import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__),'..','utils'))
import mongodb_client
from cloud_amqp_client import AMQPClient
from config_reader import get_config
from news_categories import categories_mapping

config = get_config(os.path.join(os.path.dirname(__file__),
                                 '..', 'config', 'config.json'))

USER_CLICK_QUEUE_URL = config['new_click_queue_url']
USER_CLICK_QUEUE_NAME = config['new_click_queue_name']

PREF_DB_NAME = config['preference_db']
PREF_COLLECTION_NAME = config['preference_collection']

SLEEP_TIME_IN_SECONDS = 3

NEWS_CATEGORIES = list(categories_mapping.values())

ALPHA = 0.1 # decay rate


def _get_new_pref_model():
    model = {}
    init_rank = 1 / len(NEWS_CATEGORIES)
    for cat in NEWS_CATEGORIES:
        model[cat] = init_rank
    return model


def handle_message(msg, news_collection, pref_collection):
    # print('Click Learner: {}, type: {}'.format(msg, type(msg)))
    if msg is None:
        return
    if type(msg) is not dict or 'userId' not in msg or 'newsDigest' not in msg:
        print('Click Learner: message is broken')
        return

    user_id, news_digest = msg['userId'], msg['newsDigest']
    pref_model = pref_collection.find_one({'userId': user_id})

    if pref_model is None:
        pref_model = _get_new_pref_model()
        pref_model['userId'] = user_id

    news = news_collection.find_one({'digest': news_digest})
    if news is None:
        print('Click Learner: news does not exist...')
        return

    category = news['category']
    
    # cat_selected = (1 - a) * cat_selected + a
    # cat_othw = (1 - a) * cat_othw
    for cat in NEWS_CATEGORIES:
        pref_model[cat] *= 1 - ALPHA
    pref_model[category] += ALPHA

    print('Click Learner: model for user {} changed to {}'.format(user_id, pref_model))
    pref_collection.replace_one({'userId': user_id}, pref_model, upsert=True)
    

def run(times=-1):
    click_queue_client = AMQPClient(USER_CLICK_QUEUE_URL, USER_CLICK_QUEUE_NAME)
    click_queue_client.connect()

    news_collection = mongodb_client.get_news_collection()
    pref_collection = (mongodb_client.get_db(PREF_DB_NAME)
                    .get_collection(PREF_COLLECTION_NAME))

    assert click_queue_client.is_connected()

    while True:
        msg = click_queue_client.get_message()
        try:
            handle_message(msg, news_collection, pref_collection)
        except Exception as e:
            raise e
        click_queue_client.sleep(SLEEP_TIME_IN_SECONDS)
        if times > 0: times -= 1
        if times == 0: break


if __name__ == '__main__':
    run()