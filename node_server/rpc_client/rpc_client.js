const jayson = require('jayson');
const logger = require('../utils/logger');

const client = jayson.client.http({
    host: 'localhost',
    port: 4040
})

function add(lhs, rhs, callback) {
    client.request('add', [lhs, rhs], function(err, res) {
        if (err) { throw err; }
        callback(res.result);
    })
}

function get_news_by_user(user_id, page_num, callback) {
    client.request('get_news_by_user', [user_id, page_num], function(err, res) {
        if (err) { throw err; }
        // logger.debug(typeof res.result);
        // logger.debug(res.result);
        callback(res.result);
    })
}

module.exports = {
    add,
    get_news_by_user
}