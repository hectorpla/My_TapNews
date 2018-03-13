import datetime
import hashlib
import os
import sys

import redis

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import new_api_client
from cloud_amqp_client import AMQPClient

SLEEP_TIME_IN_SECONDS = 10
NEWS_TIME_OUT_IN_SECONDS = 3600 * 24 * 3

REDIS_HOST = 'localhost'
REDIS_PORT = '6379'

SCRAPE_NEWS_TASK_QUEUE_URL = ""
SCRAPE_NEWS_TASK_QUEUE_NAME = ""

NEWS_SOURCES = [
    'cnn'
]

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)


def run():
    while True:
        new_list = new_api_client.getNews(NEWS_SOURCES)
    