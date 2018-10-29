const Client = require('./client')
const utils = require('./utils')

module.exports = async config => {
  const { db } = config

  const client = Client(config)
  const { _self } = await utils.getOrCreateDatabase(client, db)
  client.database = _self

  console.log("DATABASE LINK:", client.database)

  return client
}
