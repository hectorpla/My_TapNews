# At the begining
This project focuses on back-end services, with necessary amount of front end built by React.js

# Front end work flow
+ Users sign up and log in on the web page
+ Login sessions are maintained by the Node server, which sends tokens to the client for subsequent requests
+ Users click on news tagged with different categories and the behaviors are sent back to the user
+ Given preferences on news categories, improved list of news are provided to every user

# News pipeline (Back-end processing)
+ Source of news are from newsapi.org
+ The work flow is the order: detection of latest news, scraping for news content, deduplication and news classification. After all the mentioned steps, a valid news will be stored in MongoDB.
+ Tasks in every procedure are accommodated on cloud message queue

# Machine Learning (classifying the categories of news)
+ A supervised approach is taken
+ CNN architecture is utilized

# Future work
+ Improvement of work flow for the system with focus on maintainability
+ More complicated adjustment of recommended news list
+ Better classification with more training data