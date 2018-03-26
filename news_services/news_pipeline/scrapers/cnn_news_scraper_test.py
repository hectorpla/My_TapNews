from cnn_news_scraper import extract_news

url = 'http://money.cnn.com/2018/03/19/technology/uber-autonomous-car-fatal-crash/index.html'
some_content = 'A self-driving Uber SUV struck and killed 49-year-old Elaine Herzberg as she walked her bicycle across a street in Tempe, Arizona, Sunday night, according to the Tempe police. The department is investigating the crash.'

def test_basic():
    news = extract_news(url)
    assert some_content in news
    print('extract_new trivial case passed')

if __name__ == '__main__':
    test_basic()
