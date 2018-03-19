from multiprocessing import Process
import time
import os, sys

import news_monitor

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))
import news_client
from cloud_amqp_client import AMQPClient
from queue_cleaner import clear_queue

def test_monitor_basic():
    news_monitor.NEWS_SOURCES = news_client.MOCK_SOURCES
    MOCK_DATA = news_client.MOCK_DATA

    queue_url = news_monitor.SCRAPE_NEWS_TASK_QUEUE_URL
    queue_name = news_monitor.SCRAPE_NEWS_TASK_QUEUE_NAME

    print('test_monitor_basic: cleaning queue "{}" first---------'.format(queue_name))
    clear_queue(queue_url, queue_name)
    # TODO redis server flush all
    news_monitor.redis_client.flushall()


    print('test_monitor_basic: adding message to queue "{}"--------'.format(queue_name))
    amqp_client = AMQPClient(queue_url, queue_name)
    amqp_client.connect()

    proc = Process(target=news_monitor.run, name='monitor_run')
    proc.start()
    print('test_monitor_basic: executing... (wait for 2 seconds to cut)')
    time.sleep(2)

    proc.terminate()

    for i in range(len(MOCK_DATA)):
        message = amqp_client.get_message()
        del message['digest']
        print(message, MOCK_DATA[i])
        assert message == MOCK_DATA[i]

    print('test_monitor_basic: [x] test_monitor_basic test passed')


if __name__ == '__main__':
    test_monitor_basic()