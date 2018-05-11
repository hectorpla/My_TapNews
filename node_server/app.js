const path = require('path');
const express = require('express');
const cors = require('cors');

const index = require('./routes/index');
const news = require('./routes/news');
const auth = require('./routes/auth');
const logger = require('./utils/logger');

const app = express();

if (process.env.MongodbUrl === undefined || process.env.tokenSecret === undefined) {
    logger.error('Please specify "MongodbUrl" and "tokenSecret" in environment');
    process.exit(2);
}

// DB
const mongoose = require('mongoose');
const MongodbUrl = process.env.MongodbUrl;

// logger.debug(MongodbUrl)
mongoose.connect(MongodbUrl);
mongoose.connection.on('error', function(err) {
    logger.error(err);
    process.exit(1);
});

// passport
require('./passport/passport_main')(app);


// TODO: for developement purpose
app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use('/static', express.static(path.join(__dirname, '../tap-news/build/static/')));

app.use('/news', news);
app.use('/auth', auth);
app.use(index);

logger.info('Server has been set up.');
// logger.debug('a debug message')

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
