import os
import random
import requests

from lxml import html

USER_AGENT_FILE = ''
USER_AGENTS = []
with open(USER_AGENT_FILE, 'r') as f:
    for agent in f.readlines():
        if agent:
            USER_AGENTS.append(agent.strip('"'))
    random.shuffle(USER_AGENTS)

def _get_headers():
    return {
        "User-Agent": random.choice(USER_AGENTS)
    }

def extract_news(news_url):
    session_requests = requests.session()
    response = session_requests.get(news_url, headers=_get_headers())
    news = {}

    try:
        tree = html.fromstring()