require('dotenv').config()

const Driver = require('./dynamo-table')
const Table = require('./dynamo-table/table')

const client = Driver({
  key: process.env.DYNAMO_KEY,
  secret: process.env.DYNAMO_SECRET,
  // endpoint: 'localhost:8000'
})

const table = Table(client, {
  table: 'users',
})

async function runTest(table) {
  // const get = await table.get(upsert.id)
  // const update = await table.update(get.id, {
  //   username: 'carl',
  // })

  const many = await table.getBy('username', 'tacyarg')
  console.log(many)

}

runTest(table)

// const Driver = require('./cosmos-table')
// const Table = require('./cosmos-table/table')

// Driver({
//   host: process.env.COSMOS_HOST,
//   db: process.env.COSMOS_DB,
//   key: process.env.COSMOS_KEY,
// }).then(client => {
//   return Table(client, {
//     table: 'users',
//   })
// }).then(runTest)
