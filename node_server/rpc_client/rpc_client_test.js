var client = require('./rpc_client')
const config = require('../config/config')

function test_add() {
    client.add(2, 3, function(res) {
        console.assert(res == 5);
        console.log('RPC client successfully', res);
    })
}

function test_get_news() {
    client.get_news_by_user('node-tester', 0, function(res) {
        console.log(res);
        console.log('check if a list of news is returned')
    });
}

test_add();
test_get_news();