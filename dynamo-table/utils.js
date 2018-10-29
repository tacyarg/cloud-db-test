
async function createTable (con, name) {
  return con.createTable({
    TableName: name
  }).promise()
}

module.exports = {
  createTable
}