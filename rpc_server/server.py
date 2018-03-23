from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer
import operations

HOST_NAME = 'localhost'
PORT = 4040

server = SimpleJSONRPCServer((HOST_NAME, PORT))
server.register_function(lambda x,y: x+y, 'add')
server.register_function(lambda x: x, 'ping')
server.register_function(operations.get_news, 'get_news_by_user')
server.register_function(operations.log_click, 'log_click')

print("Py rpc server listening on {}:{}".format(HOST_NAME, PORT))
server.serve_forever()