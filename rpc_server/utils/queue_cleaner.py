from cloud_amqp_client import AMQPClient

QUEUE_URL = 'amqp://luqupawr:eptVbcV4XgQDE2XgSynoplSon5n-Ymom@donkey.rmq.cloudamqp.com/luqupawr'
SCRAPE_NEWS_TASK_QUEUE_NAME = "news_scrape_task_queue"
DEDEPUPE_NEWS_TASK_QUEUE_NAME = ""

def clear_queue(queue_url, queue_name):
    count = 0
    amqp_client = AMQPClient(queue_url, queue_name)
    amqp_client.connect()

    print('cleaning news')
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

        