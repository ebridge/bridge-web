const withFonts = require('next-fonts');
require('./loadEnv')();

const {
  EXTERNAL_API_HOST,
  EXTERNAL_API_PORT,
  INTERNAL_API_HOST,
  INTERNAL_API_PORT,
} = process.env;

/*
  When host is injected via docker, it will include a port
  This is because the host is string alias that needs a postfixed ":port"
*/
function determineApiHost(internal = false) {
  // Default to server being on localhost:4000
  if (!EXTERNAL_API_HOST && !INTERNAL_API_HOST) {
    return 'localhost:4000';
  }
  // Add port if passed in env
  let host = internal ? INTERNAL_API_HOST : EXTERNAL_API_HOST;
  if (internal && INTERNAL_API_PORT) {
    host = `${host}:${INTERNAL_API_PORT}`;
  } else if (EXTERNAL_API_PORT) {
    host = `${host}:${EXTERNAL_API_PORT}`;
  }
  return host;
}

const nextConfig = {
  webpack(config) {
    return config;
  },
  /* Envs set here are build-time envs and need to also be set in
   * .env.production to be included in production Docker images */
  env: {
    CLIENT_NAME: process.env.CLIENT_NAME || 'bridge-web',
    EXTERNAL_API_HOST: determineApiHost(),
    INTERNAL_API_HOST: determineApiHost(true),
  },
};

// Required to enable hot-reloading in docker container
if (process.env.NODE_ENV !== 'production') {
  nextConfig.webpackDevMiddleware = config => {
    // eslint-disable-next-line no-param-reassign
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  };
}

module.exports = withFonts(nextConfig);
