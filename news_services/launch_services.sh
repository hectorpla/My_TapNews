redis-server &
# mongod --dbpath /Users/hectorlueng/bittiger/data/db &

python3 news_pipeline/news_monitor.py &
python3 news_pipeline/news_fetcher.py &
python3 news_pipeline/news_deduper.py &

echo"=================================================="
read -p "PRESS[ANYKEY]TOTERMINATEPROCESSES." PRESSKEY

pkill -f news_monitor.py
pkill -f news_fetcher.py
pkill -f news_deduper.py

redis-cli shutdown