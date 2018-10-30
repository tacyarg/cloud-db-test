const uuid = require('uuid/v4')
const lodash = require('lodash')
const assert = require('assert')
const Promise = require('bluebird')

module.exports = function(client, schema) {
  assert(client, 'requires db connection')
  assert(schema, 'requires db schema')
  assert(schema.table, 'requires schema table')

  const bucket = client.openBucket(schema.table)

  async function upsert(data) {
    assert(lodash.isObject(data), 'data should be an object.')
    if (!data.id) data.id = uuid()
    return Promise.fromCallback(done => {
      bucket.upsert(data.id, data, done)
    }).then(result => {
      return data
    })
  }

  async function get(id) {
    assert(lodash.isString(id), 'id should be an string.')
    return Promise.fromCallback(done => {
      bucket.get(id, done)
    }).then(result => {
      return result.value
    })
  }

  async function update(id, data) {
    assert(lodash.isString(id), 'id should be an string.')
    assert(lodash.isObject(data), 'data should be an object.')
    const doc = await get(id)
    const update = lodash.defaults(data, doc)
    return Promise.fromCallback(done => {
      bucket.replace(id, update, done)
    }).then(result => {
      return update
    })
  }

  async function getAll(ids) {
    assert(lodash.isArray(ids), 'ids should be an array.')
    return Promise.fromCallback(done => {
      bucket.getMulti(ids, done)
    })
  }

  async function getBy(index, value) {
    query = client.N1qlQuery.fromString(`
      SELECT * FROM ${schema.table} WHERE ${index}=${value}
    `)
    return Promise.fromCallback(done => {
      bucket.query(query, done)
    })
  }

  async function list(limit = 100, offset = 0) {
    query = client.N1qlQuery.fromString(`
      SELECT * FROM ${schema.table} LIMIT ${limit} OFFSET ${offset}
    `)
    return Promise.fromCallback(done => {
      bucket.query(query, done)
    })
  }

  async function create(data) {
    assert(lodash.isObject(data), 'data should be an object.')
    if (!data.id) data.id = uuid()
    return Promise.fromCallback(done => {
      bucket.insert(data.id, data, done)
    }).then(result => {
      return data
    })
  }

  async function remove(id) {
    assert(lodash.isString(id), 'id should be an string.')
    return Promise.fromCallback(done => {
      bucket.remove(id, done)
    }).then(result => {
      return true
    })
  }

  return {
    schema,
    bucket,
    upsert,
    get,
    update,
    getAll,
    getBy,
    list,
    create,
    remove,
  }
}
