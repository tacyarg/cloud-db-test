const Promise = require('bluebird')
const assert = require('assert')

function createDatabase(con, name) {
  assert(con, 'connection required')
  assert(name, 'database name required')
  return Promise.fromCallback(done => {
    return con.createDatabase(
      {
        id: name,
      },
      done
    )
  })
}

function getDatabase(con, name) {
  assert(con, 'connection required')
  assert(name, 'database name required')

  const querySpec = {
    query: 'SELECT * FROM root r WHERE r.id= @id',
    parameters: [
      {
        name: '@id',
        value: name,
      },
    ],
  }

  return Promise.fromCallback(done => {
    return con.queryDatabases(querySpec).toArray(done)
  }).then(results => {
    return results.length > 0 ? results[0] : null
  })
}

async function getOrCreateDatabase(con, name) {
  const database = await getDatabase(con, name)

  if (!database) {
    return createDatabase(con, name)
  }

  return database
}

function createCollection(con, name) {
  assert(con, 'connection required')
  assert(con.database, 'database not initialized')
  assert(name, 'collection name required')

  return Promise.fromCallback(done => {
    return con.createCollection(
      con.database,
      {
        id: name,
      },
      done
    )
  })
}

function getCollection(con, name) {
  assert(con, 'connection required')
  assert(con.database, 'database not initialized')
  assert(name, 'collection name required')

  var querySpec = {
    query: 'SELECT * FROM root r WHERE r.id=@id',
    parameters: [
      {
        name: '@id',
        value: name,
      },
    ],
  }

  return Promise.fromCallback(done => {
    return con.queryCollections(con.database, querySpec).toArray(done)
  }).then(results => {
    return results.length > 0 ? results[0] : null
  })
}

async function getOrCreateCollection(con, name) {
  const collection = await getCollection(con, name)

  if (!collection) {
    return createCollection(con, name)
  }

  return collection
}

module.exports = {
  createDatabase,
  getDatabase,
  getOrCreateDatabase,
  createCollection,
  getCollection,
  getOrCreateCollection,
}
