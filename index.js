require('dotenv').config()
const faker = require('faker');
const lodash = require('lodash')

// COUCHBASE

const Driver = require('./couchbase-table')
const Table = require('./couchbase-table/table')

const client = Driver({
  host: 'couchbase://45.63.66.169/pools',
  // user: 'admindev',
  // pass: 'admindev'
  user: 'tacyarg',
  pass: 'tacyarg'
})
const table = Table(client, {
  table: 'users'
})

// table.list().then(console.log)

async function runTest(table) {

  const upsert = await table.upsert({
    username: 'tacyarg',
    email: 'jdent@tacyarg.com'
  })

  const get = await table.get(upsert.id)
  const update = await table.update(get.id, {
    username: 'carl',
  })

  console.log(upsert, get, update)
}

// runTest(table)

function createUser() {
  return table.create({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    name: faker.name.findName(),
    department: faker.commerce.department()
  })
}

async function stress() {
  const delay = lodash.random(1, 1000)
  try{
    const upsert = await createUser()
    console.log(delay, upsert)
    setTimeout(stress, delay)
  } catch(e) {
    stress()
  }
}

// start many threads
lodash.times(2048, stress)




// DYNAMO_DB

// const Driver = require('./dynamo-table')
// const Table = require('./dynamo-table/table')

// const client = Driver({
//   key: process.env.DYNAMO_KEY,
//   secret: process.env.DYNAMO_SECRET,
//   // endpoint: 'localhost:8000'
// })

// const table = Table(client, {
//   table: 'users',
// })


// COSMOS_DB

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
