const CosmosDB = require('documentdb').DocumentClient

module.exports = config => {
  const { host, key } = config
  
  const client = new CosmosDB(host, {
    masterKey: key,
  })

  return client
}
