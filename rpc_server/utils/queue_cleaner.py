import os

from cloud_amqp_client import AMQPClient

environ = os.environ
QUEUE_URL = environ["scrape_task_queue_url"]
SCRAPE_NEWS_TASK_QUEUE_NAME = environ["scrape_task_queue_name"]
DEDUPE_NEWS_TASK_QUEUE_NAME = environ["dedupe_task_queue_name"]

def clear_queue(queue_url, queue_name):
    count = 0
    amqp_client = AMQPClient(queue_url, queue_name)
    amqp_client.connect()

    print('cleaning queue "{}"'.format(queue_name))
    while True:
        message = amqp_client.get_message()
        print(message)
        if message is None:
            break
        count += 1
    
    amqp_client.close()
    
    print('cleaned {} message on {}'.format(count, queue_name))

if __name__ == '__main__':
    clear_queue(QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
    clear_queue(QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)

        