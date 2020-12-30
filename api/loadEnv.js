/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const dotenvFlow = require('dotenv-flow');

function loadEnv() {
  // Prevent loadEnv from logging twice
  let shouldLog = true;
  if (process.env.ENVIRONMENT_LOADED === 'true') {
    shouldLog = false;
    return;
  }
  process.env.ENVIRONMENT_LOADED = 'true';

  // Production builds won't try to read from filesystem for environment
  if (process.env.NODE_ENV === 'production') {
    if (shouldLog) {
      console.log('Not injecting variables in production env.')
    }
    return;
  }

  const envPaths = [];

  const dotEnvPath = path.join(__filename, '..', '.env');
  const secretPath = path.join(__filename, '..', '.env.secrets');

  try {
    if (fs.existsSync(secretPath)) {
      envPaths.push(secretPath);
    } else {
      // eslint-disable-next-line no-console
      console.log('No .env.secrets file found in root directory');
    }
    if (fs.existsSync(dotEnvPath)) {
      envPaths.push(dotEnvPath);
    } else {
      // eslint-disable-next-line no-console
      console.log('No .env file found in root directory');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  // Get obj of envVars from files
  const environmentVars = dotenvFlow.parse(envPaths);

  // Set global envs
  Object.entries(environmentVars).forEach(([key, value]) => {
    process.env[key] = value;
  });

  // overwrite envs with docker env if necessary
  let dockerVariables = 0;
  Object.entries(process.env).forEach(([key, value]) => {
    // If a DOCKER_ variable passed in from compose, overwrite global env var with docker env var
    if (typeof key === 'string' && key.split('_')[0] === 'DOCKER') {
      dockerVariables += 1;
      const adjustedKey = key.slice(key.indexOf('_') + 1, key.length);
      process.env[adjustedKey] = value;
    }
  });

  if (dockerVariables) {
    if (shouldLog) {
      console.log(`Injected ${dockerVariables} DOCKER_ prefixed envs.`);
    }
  }
}

module.exports = loadEnv;
