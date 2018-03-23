var client = require('./rpc_client');
const config = require('../config/config');
const logger = require('../utils/logger');

function test_add() {
    client.add(2, 3, function(res) {
        logger.debug('test_add: 2 + 3 =', res);
        console.assert(res == 5);
    })
}

function test_get_news() {
    client.get_news_by_user('node-tester', 0, function(res) {
        logger.debug('test_get_news: result --->\n', res);
        console.assert(res !== undefined);
    });
}

function test_log_click() {
    client.log_click('node-tester', 'news-digest:%%%', function(res) {
        logger.debug('log_click successfully (callback is called)');
    })
}

console.log('rpc')
test_add();
test_get_news();
test_log_click();