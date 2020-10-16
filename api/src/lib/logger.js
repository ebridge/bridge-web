/* eslint-disable no-console */
// Import logger in other modules like: "const logger = require('../logger)(module)""
const winston = require('winston');
require('winston-daily-rotate-file');
const moment = require('moment-timezone');
const path = require('path');
const colors = require('colors');
const StackTracey = require('stacktracey');

const logFilePath = path.join(__filename, '..', '..', '..', 'logs');
const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  postgres: 4,
  mongo: 5,
  redis: 6,
};
const COLORS_FOR_LEVEL = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  debug: 'cyan',
  postgres: 'bgGreen',
  mongo: 'bgCyan',
  redis: 'bgYellow',
};

if (process.env.NODE_ENV === 'test') {
  process.env.CONSOLE_LOG_LEVEL = -1;
  process.env.FILE_LOG_LEVEL = -1;
}

const logger = winston.createLogger({
  levels: LEVELS,
  transports: [
    new winston.transports.Console({
      level: process.env.CONSOLE_LOG_LEVEL,
      json: false,
      format: getLogFormat(false),
    }),
    new (winston.transports.DailyRotateFile)({
      filename: 'all-logs-%DATE%.log',
      dirname: logFilePath,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: process.env.FILE_LOG_LEVEL,
      format: getLogFormat(),
    }),
    new (winston.transports.DailyRotateFile)({
      filename: 'errors-%DATE%.log',
      dirname: logFilePath,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: getLogFormat(),
    }),
  ],
  exceptionHandlers: [
    new (winston.transports.DailyRotateFile)({
      filename: 'exceptions-%DATE%.log',
      dirname: logFilePath,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: getLogFormat(),
    }),
    new winston.transports.Console({
      json: false,
      format: getLogFormat(false),
    }),
  ],
  exitOnError: false,
});

// eslint-disable-next-line no-unused-vars
function getLogFormat(isFile = true) {
  return winston.format.printf((info) => {
    const timestamp = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');

    let levelDisplay = info.level;
    if (!isFile) {
      const color = COLORS_FOR_LEVEL[info.level];
      levelDisplay = colors[color](levelDisplay);
    }

    let output = `[type]='${levelDisplay}' [date]='${timestamp}' [file]='${info.filename}' [message]='${info.message}'`;

    if (info.error) {
      output += ` [error_message]=${info?.error?.message}`;
      const prettyPrintStackString = new StackTracey(info?.error).pretty;
      output += ` \n[error_stack]=\n${prettyPrintStackString}`;
    }

    if (info.customInput) {
      output += ` ${formatCustomInput(info.customInput)}`;
    }

    return output;
  });
}

function formatCustomInput(input) {
  if (typeof input !== 'object') {
    return '[custom_input_error]=not an object';
  }

  return Object.keys(input).map((key) => `[${key}]='${input[key]}'`).join(' ');
}

console.log(`Logging to console above log level: ${process.env.CONSOLE_LOG_LEVEL}`);
console.log(`Logging to files above log level: ${process.env.FILE_LOG_LEVEL}`);

module.exports = (module) => {
  if (!module) {
    logger.warn(`Logger imported incorrectly. Call default export as function passing module.
      \n e.g. const logger = require('../logger)(module)`);
  }
  const filename = module.id;
  const loggerObj = {};

  /* Allows for custom usage of logger that includes caller's filename
     E.g. logger.info('My message', { id: 5, name: bob })
     Will output:
     [type]='info' [date]='2020-04-05 01:28:17' [file]='src/server.js' [message]='My message'
  */
  Object.keys(LEVELS).forEach((level) => {
    loggerObj[level] = (msg, options) => logger[level](msg, {
      ...options,
      filename,
    });
  });

  return loggerObj;
};
