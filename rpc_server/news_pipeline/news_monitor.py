import datetime
import hashlib
import os
import sys

import redis

# for unregular import
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))

import news_client
from cloud_amqp_client import AMQPClient
from config_reader import get_config

config = get_config('../config/config.json')
REDIS_HOST = config['redis_host']
REDIS_PORT = config['redis_port']

config = get_config('../config/config.json')
SCRAPE_NEWS_TASK_QUEUE_URL = config['scrape_task_queue_url']
SCRAPE_NEWS_TASK_QUEUE_NAME = config['scrape_task_queue_name']

NEWS_SOURCES = [
    'cnn'
]

SLEEP_TIME_IN_SECONDS = 60
NEWS_TIME_OUT_IN_SECONDS = 3600 * 24 * 3

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)
amqp_client = AMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, 
                         SCRAPE_NEWS_TASK_QUEUE_NAME)

def run():
    amqp_client.connect()
    while True:
        news_list = news_client.get_news_from_sources(NEWS_SOURCES)
        num_news = 0

        for news in news_list:
            digest = hashlib.md5(news['title'].encode('utf-8')).hexdigest()

            if redis_client.get(digest):
                continue

            num_news += 1
            news['digest'] = digest
            redis_client.set(digest, True)
            redis_client.expire(digest, NEWS_TIME_OUT_IN_SECONDS)

            print(news)
            amqp_client.send_message(news)

        print('fectched {} news'.format(num_news))
        amqp_client.sleep(SLEEP_TIME_IN_SECONDS)

if __name__ == '__main__':
    run()
