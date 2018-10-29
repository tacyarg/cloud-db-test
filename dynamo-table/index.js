var AWS = require('aws-sdk')

module.exports = function(config) {
  const { key, secret, region, endpoint } = config

  const client = new AWS.DynamoDB.DocumentClient({
    accessKeyId: key,
    secretAccessKey: secret,
    region: region || 'ca-central-1',
    endpoint: endpoint,
  })

  return client
}
