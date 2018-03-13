import json

import requests

NEWS_API_ENDPOINT = "http://newsapi.org/v1"
API_KEY = ""
ARTICLES_API = "articles"

CNN = "cnn"
DEFAULT_SOURCES = [CNN]
SORT_BY = "top"

def _buildUrl(endpoint=NEWS_API_ENDPOINT, api_name=ARTICLES_API):
    return endpoint + api_name

def get_news_from_sources(sources=DEFAULT_SOURCES, sortby=SORT_BY):
    articles = []

    for source in sources:
        payload = {
            'apiKey': API_KEY,
            'source': source,
            'sortBy': sortby
        }
        response = requests.get(_buildUrl(), params=payload)
        res_json = json.loads(response.content.decode('utf-8'))

        # 
        # if 'source' not in res_json:
        #     continue
        articles.extend(res_json)

    return articles