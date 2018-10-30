const CouchBase = require('couchbase')

module.exports = function(config) {
  const { host, user, pass } = config

  const cluster = new CouchBase.Cluster(host)
  cluster.authenticate(user, pass)
  cluster.N1qlQuery = CouchBase.N1qlQuery
  cluster.ViewQuery = CouchBase.ViewQuery
  
  return cluster
}
