/**
 * This is a sample RESTful API server
 * It is not intended for production use
 */

// Imports
const express = require('express')
const parser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const $logger = require('./logger')
const pino = require('pino');
const epino = require('express-pino-logger');
const $config = require('./config.json');
const routes = require("./api-routes")

// Setup server port
const port = process.env.PORT || 8080;

// Initialize the app
const app = express();

// web server plugins
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json({ type: ['application/json', 'application/json-patch+json'] }));
app.use(epino({
    level: 'info'
}, pino.destination('./log/access.log')));


app.disable('x-powered-by');
app.set('etag', false)
// CORS settings - not for a prod env
app.use(cors());
app.options('*', cors());

// API routes settings
app.use('/api', routes);

// MongoDB connection setup
mongoose.connect($config.storage.url, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

// Added check for DB connection
if (!db) {
    $logger.error("DB connection failure")
    return;
}
else {
    $logger.info(`DB connected on ${$config.storage.url}`);
}


// Launch app to listen to specified port
app.listen(port, function () {
    $logger.info(`API server running on port ${port}`);
});