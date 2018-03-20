import os
import sys
import time
from multiprocessing import Process

import redis

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))
import news_client
from cloud_amqp_client import AMQPClient
import queue_cleaner
import news_fetcher

# TODO use config file instead of envron
environ = os.environ
SCRAPE_QUEUE_URL = environ["scrape_task_queue_url"]
DEDUPE_QUEUE_URL = environ["dedupe_task_queue_url"]
SCRAPE_NEWS_TASK_QUEUE_NAME = environ["scrape_task_queue_name"]
DEDUPE_NEWS_TASK_QUEUE_NAME = environ["dedupe_task_queue_name"]

TEST_SCRAPE_TASK = [
    'not a dict',
    {
        'url': 'some-other-soucr.com',
        'source': 'not cnn'
    },
    {
        'title': 'Uber pulls self-driving cars after first fatal crash of autonomous vehicle', 
        'url': 'http://money.cnn.com/2018/03/19/technology/uber-autonomous-car-fatal-crash/index.html', 
        'source': 'cnn'
    },
    {
        'title': 'Loophole would protect self-driving car companies from lawsuits', 
        'url': 'http://money.cnn.com/2018/03/14/technology/self-driving-car-senate-loophole/index.html', 
        'source': 'cnn'
    }
]

REDIS_HOST = 'localhost'
REDIS_PORT = '6379'
redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)

def test_basic():
    print('news_fetcher_test: cleaning all queues...')
    queue_cleaner.clear_all()
    print('flushing all cache in Redis')
    redis_client.flushall()

    scrape_queue_client = AMQPClient(SCRAPE_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
    scrape_queue_client.connect()
    assert scrape_queue_client.is_connected()

    print('test_fetcher_basic: adding news onto scrape queue...')
    for message in TEST_SCRAPE_TASK:
        scrape_queue_client.send_message(message)

    proc = Process(target=news_fetcher.run, name='fetcher_run')
    proc.start() # TODO: error: OSError: [Errno 9] Bad file descriptor
    # see https://github.com/emc-isilon/pike/issues/38
    print('test_fetcher_basic: executing... (wait for 15 seconds to cut)')
    time.sleep(15)

    proc.terminate()

    should_be_empty_msg = scrape_queue_client.get_message()
    print(should_be_empty_msg)
    assert should_be_empty_msg is None
    scrape_queue_client.close()

    queue_cleaner.clear_queue(DEDUPE_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)
    print('news_fetcher test passed')

if __name__ == '__main__':
    test_basic()