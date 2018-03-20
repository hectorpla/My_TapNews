import datetime
import os
import sys

import json
from dateutil import parser
from sklearn.feature_extraction.text import TfidfVectorizer

sys.path.append(os.path.join(os.path.dirname(__file__),'..','utils'))
# sys.path.append(os.path.join(os.path.dirname(__file__),'..','config')
import mongodb_client
from cloud_amqp_client import AMQPClient

DB_NAME = 'my-tab-news'
COLLECTION_NAME = 'news'
NEWS_SIMILARITY_THRESHOLD = 0.8

DEDUPE_QUEUE_URL = None
DEDUPE_QUEUE_NAME = None
dedupe_queue_client = None

SLEEP_TIME_IN_SECONDS = 5

# globally managed, consider turning the program into a class
def init():
    config = None
    with open('../config/config.json') as f:
        config = json.load(f)

    if config is None:
        print('config invalid...')
        return
    DEDUPE_QUEUE_URL = config['dedupe_task_queue_url']
    DEDUPE_QUEUE_NAME = config['dedupe_task_queue_name']

    dedupe_queue_client = AMQPClient(DEDUPE_QUEUE_URL, DEDUPE_QUEUE_NAME)
    dedupe_queue_client.connect()

    assert dedupe_queue_client.is_connected()


def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        print('news fetcher: message is broken')
        return

    task = msg
    if 'text' not in task or not task['text']:
        return

    published_at = parser.parse(task['publishedAt'])
    
    day_begin = datetime.datetime(published_at.year,
                                  published_at.month,
                                  published_at.day,
                                  0, 0, 0, 0)

    day_end = day_begin + datetime.timedelta(days=1)

    news_collection = mongodb_client.get_db(DB_NAME).get_collection(COLLECTION_NAME)
    news_on_the_day = news_collection.find({
        'publishedAt': {'$gte': day_begin, '$lt': day_end}
    })

    documents = [task['text']]
    documents.extend(news['text'] for news in news_on_the_day)
    tf_idf = TfidfVectorizer().fit_transform(documents)

    similarity_matrix = tf_idf * tf_idf.T
    num_rows = similarity_matrix.shape[0]
    if any(similarity_matrix[0, i] > NEWS_SIMILARITY_THRESHOLD for i in range(1, num_rows)):
        print('similar document, throw it away')
        return

    # reformat the published date, and mongodb can interpret it
    task['publisheAt'] = published_at
    news_collection.replace_one({'digest': task['digest']}, task, upsert=True)


def run():
    init()

    while True:
        msg = dedupe_queue_client.get_message()
        if msg is not None:
            try:
                handle_message(msg)
            except Exception as e:
                print(e)
        dedupe_queue_client.sleep(SLEEP_TIME_IN_SECONDS)


if __name__ == '__main__':
    run()


