# for news serving/click handling test with minification setup

redis-server &
mongod --dbpath /Users/hectorlueng/bittiger/data/db &

python3 preference_model/clicklearner.py &
python3 rpc_server.py &

echo"=================================================="
read -p "PRESS[ANYKEY]TOTERMINATEPROCESSES." PRESSKEY

pkill -f clicklearner.py
pkill -f rpc_server.py

pkill mongod
redis-cli shutdown