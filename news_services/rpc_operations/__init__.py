import sys
import os

import redis
sys.path.append(os.path.join(os.path.dirname(__file__),'..','utils'))
import mongodb_client
from config_reader import get_config
from cloud_amqp_client import AMQPClient

# TODO makes server.py work, but not certain if it is a good practice
sys.path.append(os.path.join(os.path.dirname(__file__)))
from newsgetter import get_news_for_user
from clickdilivery import send_click

# TODO should make a more reliable way to find the config file
config = get_config(os.path.join(os.path.dirname(__file__),
                                 '..', 'config', 'config.json'))

DB_NAME = config['news_db']
COLLECTION_NAME = config['new_collection']
# TODO: for test, change db name and collection name for real product
# DB_NAME = 'demo' 
# COLLECTION_NAME = 'news'
REDIS_HOST = config['redis_host']
REDIS_PORT = config['redis_port']

USER_CLICK_QUEUE_URL = config['new_click_queue_url']
USER_CLICK_QUEUE_NAME = config['new_click_queue_name']


# TODO should do init here? or let the sub-module take care of them
mongo_collection = mongodb_client.get_db(DB_NAME).get_collection(COLLECTION_NAME)

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)

click_queue_client = AMQPClient(USER_CLICK_QUEUE_URL, USER_CLICK_QUEUE_NAME)


__all__ = ['get_news', 'log_click']

# for test, maybe bad
def init():
    global click_queue_client
    click_queue_client = AMQPClient(USER_CLICK_QUEUE_URL, USER_CLICK_QUEUE_NAME)

def get_news(user_id, page_num):
    print('++ RPC server: get news for {}, page #{}'.format(user_id, page_num))
    return get_news_for_user(mongo_collection,
                             redis_client,
                             user_id, page_num)

def log_click(user_id, news_digest):
    print('++ RPC server: user {} clicked news {}'.format(user_id, news_digest))
    send_click(click_queue_client, user_id, news_digest)