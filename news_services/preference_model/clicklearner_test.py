import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__),'..','utils'))
import mongodb_client
from cloud_amqp_client import AMQPClient
from queue_cleaner import clear_queue

import clicklearner

PREF_DB_NAME = clicklearner.PREF_DB_NAME
PREF_COLLECTION_NAME = 'test'

news_collection = mongodb_client.get_news_collection()
pref_collection = mongodb_client.get_db(PREF_DB_NAME).get_collection(PREF_COLLECTION_NAME)

ALPHA = clicklearner.ALPHA

NEWS_CATEGORIES = clicklearner.NEWS_CATEGORIES

one_news_digest = mongodb_client.get_news_collection().find_one()['digest']

CLICK_QUEUE_NAME = 'test'
TEST_USER_NAME = 'aaa'
TEST_SEQUENCE = [
    {
        'userId': TEST_USER_NAME,
        'newsDigest': one_news_digest
    },
    {
        'userId': TEST_USER_NAME,
        'newsDigest': one_news_digest
    }
]


def test_basic():
    # print('Click Learner tester: clearing queue {}'.format(CLICK_QUEUE_NAME))
    clear_queue(clicklearner.USER_CLICK_QUEUE_URL, CLICK_QUEUE_NAME)

    clicklearner.PREF_COLLECTION_NAME = PREF_COLLECTION_NAME
    clicklearner.USER_CLICK_QUEUE_NAME = CLICK_QUEUE_NAME
    clicklearner.SLEEP_TIME_IN_SECONDS = 1

    click_queue_client = AMQPClient(clicklearner.USER_CLICK_QUEUE_URL,
                                    CLICK_QUEUE_NAME)
    click_queue_client.connect()

    assert click_queue_client.is_connected()

    print('Click Learner tester: clearing collection "{}" in db "{}"...'.format(PREF_COLLECTION_NAME, 
        PREF_DB_NAME))
    pref_collection.remove()

    print('Click Learner tester: sending click logs')
    for click in TEST_SEQUENCE:
        click_queue_client.send_message(click)
    

    print('Click Learner tester: start handling clicks')

    pref_model_ref = {'userId': TEST_USER_NAME}
    for cat in NEWS_CATEGORIES:
        pref_model_ref[cat] = 1 / len(NEWS_CATEGORIES)

    for click_log in TEST_SEQUENCE:
        clicklearner.run(1)
        pref_model = pref_collection.find_one({'userId': TEST_USER_NAME})

        selected = news_collection.find_one({'digest': (click_log['newsDigest'])})['category']
        pref_model_ref[selected] = (1 - ALPHA) * pref_model_ref[selected] + ALPHA
        for cat in NEWS_CATEGORIES:
            if cat != selected:
                pref_model_ref[cat] = (1 - ALPHA) * pref_model_ref[cat]

        del pref_model['_id']
        print('Click Learner tester: expecting {} == {}'.format(pref_model, pref_model_ref))
        assert pref_model == pref_model_ref

    print('xx Click Learner test passed')


if __name__ == '__main__':
    test_basic()
        