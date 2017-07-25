// ======================================================
// Module dependencies.
// ======================================================
const http        = require('http');
const express     = require('express');
const bodyParser  = require('body-parser');
const logger      = require('morgan');
const dotenv      = require('dotenv');
const setupApi    = require('./api/index');

// ======================================================
// Read environment config
// ======================================================
dotenv.config();

// ======================================================
// Connect to MongoDB
// ======================================================
const app        = express();
const httpServer = http.createServer(app);

// ======================================================
// App Configuration
// ======================================================
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ======================================================
// Api Router
// ======================================================
setupApi(app);

// ======================================================
// Listen on Port
// ======================================================
httpServer.listen(process.env.HTTP_PORT);
