import sys
import os

import redis
sys.path.append(os.path.join(os.path.dirname(__file__),'..','utils'))
import mongodb_client
from config_reader import get_config

config = get_config('../config/config.json')
DB_NAME = config['news_db']
COLLECTION_NAME = config['new_collection']
REDIS_HOST = config['redis_host']
REDIS_PORT = config['redis_port']

mongo_collection = mongodb_client.get_db(DB_NAME).get_collection(COLLECTION_NAME)

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)


from getnews import get_news_for_user

def get_news(user_id, page_num):
    return get_news_for_user(mongo_collection,
                             redis_client,
                             user_id, page_num)
