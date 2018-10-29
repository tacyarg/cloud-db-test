const uuid = require('uuid/v4')
const lodash = require('lodash')
const assert = require('assert')
const Promise = require('bluebird')

module.exports = function(dynamo, schema) {
  assert(dynamo, 'requires db connection')
  assert(schema, 'requires db schema')

  async function upsert(data) {
    assert(lodash.isObject(data), 'data should be an object.')
    if (!data.id) data.id = uuid()
    const result = await dynamo
      .put({ TableName: schema.table, Item: data })
      .promise()
    return data
  }

  async function get(id) {
    assert(lodash.isString(id), 'id should be an string.')
    const data = await dynamo
      .get({
        TableName: schema.table,
        Key: {
          id,
        },
      })
      .promise()
    return data.Item
  }

  async function update(id, data) {
    assert(lodash.isString(id), 'id should be an string.')
    assert(lodash.isObject(data), 'data should be an object.')

    const document = await get(id)
    const update = lodash.defaults(data, document)

    return upsert(update)
  }

  async function getAll(ids) {
    return Promise.map(ids, get, { concurrency: 10 })
  }

  async function getBy(index, value) {
    const data = await dynamo
      .query({
        TableName: schema.table,
        IndexName: index,
        KeyConditionExpression: 'username=:username',
        ExpressionAttributeValues: {
          ':username': value,
        },
      })
      .promise()
    return data.Items
  }

  return { schema, upsert, get, update, getAll, getBy }
}
