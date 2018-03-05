from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer

HOST_NAME = 'localhost'
PORT = 4040

server = SimpleJSONRPCServer((HOST_NAME, PORT))
server.register_function(pow)
server.register_function(lambda x,y: x+y, 'add')
server.register_function(lambda x: x, 'ping')

print("Py rpc server listening on {}:{}".format(HOST_NAME, PORT))
server.serve_forever()