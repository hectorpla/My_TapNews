const jayson = require('jayson');
const logger = require('../utils/logger');

const env = process.env;
const port = env.RPCPort || 80;

logger.debug('rpc client:', env.RPCHost, port);
const client = jayson.client.http({
    host: env.RPCHost,
    port: port
})

function add(lhs, rhs, callback) {
    client.request('add', [lhs, rhs], function(err, res) {
        if (err) { throw err; }
        callback(res.result);
    })
}

function get_news_by_user(user_id, page_num, callback, error_callback) {
    client.request('get_news_by_user', [user_id, page_num], function(err, res) {
        if (err) {
            logger.error(err);
            if (error_callback) { error_callback(err); }
            return;
        }
        // logger.debug(typeof res.result);
        // logger.debug(res.result);
        callback(res.result);
    })
}

function log_click(user_id, news_digest, callback) {
    client.request('log_click', [user_id, news_digest], function(err, res) {
        if (err) { 
            logger.error(err);
            if (error_callback) { error_callback(err); }
            return;
        }
        callback(res.result);
    })
}

module.exports = {
    add,
    get_news_by_user,
    log_click
}