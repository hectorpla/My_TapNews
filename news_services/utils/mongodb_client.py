from pymongo import MongoClient

HOST_NAME = 'localhost'
PORT = 27017
DB_NAME = 'my-tab-news'

client = MongoClient(HOST_NAME, PORT)

def get_db(db=DB_NAME):
    return client[db]


def main():
    db = client.demo

    collection = db['news']

    one_record = collection.find_one()

    print(one_record)


if __name__ == '__main__':
    main()