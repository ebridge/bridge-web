/* eslint-disable no-console */
const moment = require('moment');

const filterLogLevel = 'debug'; // TODO: Make env var
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};
const LOG_LEVEL_COLORS = {
  debug: '#00FFFF',
  info: '#00FF00',
  warn: '#FFA500',
  error: '#FF0000',
};

const logger = {};

function log(level, message, opts = {}) {
  if (!Object.keys(LOG_LEVELS).includes(level)) {
    console.warn(`Invalid log level: ${level} passed to logger.`);
    return null;
  }

  if (logLevelIsFiltered(level)) {
    return null;
  }

  const timestamp = moment().format('hh:mm:ss a');

  let output = `[time]='${timestamp}' [level]='${level}' [message]='${message}'`;
  if (opts.customInputs) {
    output += ` ${formatCustomInput(opts.customInputs)}`;
  }

  console[level](output, `color: ${LOG_LEVEL_COLORS[level]}`);
  return true;
}

function formatCustomInput(input) {
  if (typeof input !== 'object') {
    return '[custom_input_error]=not an object';
  }
  return Object.keys(input).map((key) => `[${key}]=${input[key]}`).join(' ');
}

function logLevelIsFiltered(currentLevel) {
  if (typeof LOG_LEVELS[filterLogLevel] === 'undefined') {
    logger.warn(null, `Invalid filterLogLevel option of "${filterLogLevel}". Logs will not be filtered.`);
    return false;
  }

  return LOG_LEVELS[currentLevel] < LOG_LEVELS[filterLogLevel];
}

logger.debug = (msg, opts) => log('debug', msg, opts);
logger.info = (msg, opts) => log('info', msg, opts);
logger.warn = (msg, opts) => log('warn', msg, opts);
logger.error = (msg, opts) => log('error', msg, opts);

export default logger;
