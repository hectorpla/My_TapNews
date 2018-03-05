var client = require('./rpc_client')

client.request('add', [1, 2], function(err, res) {
if (err) {
        throw err;
    }
    console.assert(res.result == 3);
    console.log('successfully', res);
})