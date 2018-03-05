from pymongo import MongoClient

HOST_NAME = 'localhost'
PORT = 27017

client = MongoClient(HOST_NAME, PORT)

db = client.demo

collection = db['demo-news']

one_record = collection.find_one()

print(one_record)