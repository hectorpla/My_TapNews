import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))
import mongodb_client
import classifier_client

def get_feature_text(news):
    if 'title' not in news:
        return None
    return news['title']

# TODO should add test
def backfill():
    news_collection = mongodb_client.get_news_collection()

    # a not straightforward update method
    for news in news_collection.find():
        # 1. classify news
        feature_text = get_feature_text(news)
        if feature_text is None: continue
        category = classifier_client.classify(feature_text)

        # 2. write back to the db
        news_collection.update_one({'digest': news['digest']}, 
                                   {'$set': {'category': category}})


    # update() doesn't support reference to properties of the documents
    # news_collection.update_many({'title': {'$exists': True}},
    #                             {'category': })

if __name__ == '__main__':
    backfill()