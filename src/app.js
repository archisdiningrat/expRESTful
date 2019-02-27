const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const {
    HttpError, DBContext, MongoContext, RedisContext, Job
} = require('./common');
const apiGuard = require('./middlewares/request-handler/api_guard');
const rateLimiter = require('./utils/rate_limiter');
const routeHandler = require('./routes');
const exceptionHandler = require('./exceptions');

/** Initialize Express */
const app = express();

/** Initialize Singletons */
HttpError.initialize();
DBContext.initialize();
MongoContext.initialize();
RedisContext.initialize();
Job.initialize();

/** Plugins */
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/** Global Middlewares */
app.use(apiGuard);
app.use(rateLimiter());

/** App Handlers */
routeHandler(app);
exceptionHandler(app);

module.exports = app;
