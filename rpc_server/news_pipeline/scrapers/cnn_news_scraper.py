import os
import random
import requests

from lxml import html

GET_CNN_NEWS_XPATH = """//div[@id='storycontent']//p//text()"""


USER_AGENT_FILE = 'scraper_agents.txt'
USER_AGENTS = []


with open(USER_AGENT_FILE, 'r') as f:
    for agent in f.readlines():
        # agent = agent.decode()
        agent = agent.strip()
        if agent:
            USER_AGENTS.append(agent.strip('"'))
    random.shuffle(USER_AGENTS)

def _get_headers():
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Connection": "close"
    }

def extract_news(news_url):
    session_requests = requests.session()
    response = session_requests.get(news_url, headers=_get_headers())
    news = ''

    try:
        doc_tree = html.fromstring(response.content)
        news = doc_tree.xpath(GET_CNN_NEWS_XPATH)
        # print(news)
        news = ''.join(news)
    except:
        return ''
    return news
        