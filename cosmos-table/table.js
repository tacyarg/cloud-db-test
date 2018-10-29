const Promise = require('bluebird')
const uuid = require('uuid/v4')
const lodash = require('lodash')
const assert = require('assert')
const utils = require('./utils')

function Actions(client, schema) {
  async function upsert(data) {
    assert(lodash.isObject(data), 'data should be an object.')
    if (!data.id) data.id = uuid()
    return Promise.fromCallback(done => {
      return client.upsertDocument(client.collection, data, done)
    })
  }

  async function get(id) {
    assert(lodash.isString(id), 'id should be an string.')

    var querySpec = {
      query: 'SELECT * FROM root r WHERE r.id = @id',
      parameters: [
        {
          name: '@id',
          value: id,
        },
      ],
    }

    return Promise.fromCallback(done => {
      return client.queryDocuments(client.collection, querySpec).toArray(done)
    }).then(results => results[0])
  }

  async function update(id, data) {
    assert(lodash.isString(id), 'id should be an string.')
    assert(lodash.isObject(data), 'data should be an object.')
    
    const doc = await get(id)
    return Promise.fromCallback(done => {
      const docChanges = lodash.defaults(data, doc)
      return client.replaceDocument(doc._self, docChanges, done)
    })
  }

  return { schema, upsert, get, update }
}

module.exports = async function(client, schema) {
  assert(client, 'requires db connection')
  assert(schema, 'requires db schema')

  const { table } = schema

  const { _self } = await utils.getOrCreateCollection(client, table)
  client.collection = _self

  console.log('COLLECTION LINK:', client.collection)

  return Actions(client, schema)
}
