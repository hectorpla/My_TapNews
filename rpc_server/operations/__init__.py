import sys
import os

import redis
sys.path.append(os.path.join(os.path.dirname(__file__),'..','utils'))
import mongodb_client
from config_reader import get_config

# TODO makes server.py work, but not certain if it is a good practice
sys.path.append(os.path.join(os.path.dirname(__file__)))
from newsgetter import get_news_for_user


# TODO: should make a more reliable way to find the config file
config = get_config(os.path.join(os.path.dirname(__file__),
                                 '..', 'config', 'config.json'))

# TODO: for test, change db name and collection name for real product
DB_NAME = 'demo' # config['news_db']
COLLECTION_NAME = 'news' # config['new_collection']
REDIS_HOST = config['redis_host']
REDIS_PORT = config['redis_port']

mongo_collection = mongodb_client.get_db(DB_NAME).get_collection(COLLECTION_NAME)

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)

__all__ = ['get_news']

def get_news(user_id, page_num):
    print('++ RPC server: get news for {}, page #{}'.format(user_id, page_num))
    return get_news_for_user(mongo_collection,
                             redis_client,
                             user_id, page_num)
