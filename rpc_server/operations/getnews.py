import pymongo
import pickle
import json
import datetime
from bson import json_util

NEWS_BATCH_SIZE = 5
MAX_PROVIDE_SIZE = 100
CACHE_EXPIRE_TIME_IN_SECONDS = 2 * 60

class NewsRequestMoreThanExpectedError(Exception):
    def __init__(self, to_index):
        self.to_index = to_index

    def __str__(self):
        return '{} greater than {}'.format(self.to_index, MAX_PROVIDE_SIZE - 1)

def get_news_for_user(mongodb_collection, redis_client, user_id, page_num):
    from_index = page_num * NEWS_BATCH_SIZE
    to_index = (page_num + 1) * NEWS_BATCH_SIZE

    if to_index >= MAX_PROVIDE_SIZE:
        raise NewsRequestMoreThanExpectedError(to_index)
        # TODO consider silent it and handle

    
    news_in_page = None

    news_digest_list_digest = redis_client.get(user_id)

    if not news_digest_list_digest:
        # TODO: customize the list for different user
        total_news = (mongodb_collection.find()
                      .sort([('publishedAt', pymongo.DESCENDING)])
                      .limit(MAX_PROVIDE_SIZE))
        total_news = list(total_news)

        news_digest_list_digest = pickle.dumps([news['digest'] for news in total_news])
        redis_client.set(user_id, news_digest_list_digest)
        redis_client.expire(user_id, CACHE_EXPIRE_TIME_IN_SECONDS)
        news_in_page = total_news[from_index:to_index]
    else:
        news_digest_list = pickle.loads(news_digest_list_digest)
        selected_digests = news_digest_list[from_index:to_index]
        news_in_page = mongodb_collection.find({'digest': {'$in': selected_digests}})
        news_in_page = list(news_in_page)

    for news in news_in_page:
        if news['text']:
            del news['text']
        if news['publishedAt'] + datetime.timedelta(hours=12) < datetime.datetime.today():
            news['relativeTime'] = 'New'

    # print(news_in_page)

    # dump bson
    return json.dumps(news_in_page, default=json_util.default)
