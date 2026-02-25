// const winston = require('winston');
// const expressWinston = require('express-winston');
import winston from 'winston';
import expressWinston from 'express-winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // logs in JSON format, better for production
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Middleware for logging HTTP requests
const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  meta: true, // log meta data like headers, body
});

// Middleware for logging errors
const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

export  { logger, requestLogger, errorLogger };
