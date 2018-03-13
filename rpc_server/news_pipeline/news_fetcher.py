
def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        print('message is broken')
        return
    
    task = msg
    text = None

    if task['source'] == 'cnn':
        print('scraping')
    else:
        return

    task['text'] = text
    

def run():
    while True:
        if scrape_news_queue_client is not None:
            msg = scrape_news_queue_client.getMessage()
            if msg is not None:
                try:
                    handle_message(msg)
                except Excetion as e:
                    print(e)
                scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)