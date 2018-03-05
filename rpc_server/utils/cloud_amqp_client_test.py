import sys
from cloud_amqp_client import AMQPClient

def test():
    with open('../credetianls/amqp_url.txt', 'r') as f:
        amqp_url = f.read().strip()
        # print(amqp_url + "({})".format(type(amqp_url)))
        client = AMQPClient(amqp_url, 'my_queue')

        client.connect()

        assert client.get_message() is None

        client.send_message('hello world')

        assert client.get_message() == 'hello world'

        obj = { "hello": "world" }
        client.send_message(obj)

        assert client.get_message() == obj

        assert client.get_message() is None

        client.close()


if __name__ == '__main__':
    test()