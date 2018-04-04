import sys
import os

import pymongo

sys.path.append(os.path.join(os.path.dirname(__file__),'..','utils'))
import mongodb_client # connect to the old server

new_client = None

def connect_collection_to_migrate():
    global new_client

    environ = os.environ
    try:
        NEW_HOST = environ['new_news_db_url']
    except KeyError:
        print('Failed: Specify the environment variable "new_news_db_url"')
        exit(1)

    new_client = pymongo.MongoClient(NEW_HOST)
    

def migrate():
    old_collection = mongodb_client.get_news_collection()

    db_name = mongodb_client.DB_NAME
    collection_name = mongodb_client.COLLECTION_NAME
    new_collection = new_client[db_name][collection_name]

    for news in old_collection.find():
        new_collection.replace_one({'digest': news['digest']}, news, upsert=True)

    print('migration completed')

def test():
    new_client.list_databases()
    print('[x] check if it work well and press key to continue, otherwise cancel')

def main():
    migrate()

if __name__ == '__main__':
    connect_collection_to_migrate()
    test()
    main()