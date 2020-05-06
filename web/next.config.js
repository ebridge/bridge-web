const withFonts = require('next-fonts');
require('./loadEnv')();

const {
  API_HOST,
  API_PORT,
} = process.env;

/*
  Api host must be absolute with prefixed "http(s)://""
  When host is injected via docker, it will include a port
  This is because the host is string alias that needs a postfixed ":port"
*/
function determineApiHost(local = false) {
  if (!API_HOST) {
    return 'http://localhost:4000';
  }
  let host = local ? 'localhost' : API_HOST;
  if (API_PORT) {
    host = `${host}:${API_PORT}`;
  }
  if (host.startsWith('http')) {
    return host;
  }
  return `http://${host}`;
}

const nextConfig = {
  webpack(config) {
    return config;
  },
  env: {
    CLIENT_NAME: process.env.CLIENT_NAME || 'bridge-web',
    WEB_PORT: process.env.WEB_PORT || 3000,
    API_HOST: determineApiHost(),
    LOCAL_API_HOST: determineApiHost(true),
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
