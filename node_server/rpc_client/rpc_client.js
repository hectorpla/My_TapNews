var jayson = require('jayson')

var client = jayson.client.http({
    host: 'localhost',
    port: 4040
})

module.exports = client;