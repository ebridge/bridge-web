import axios from 'axios';
import logger from '../lib/logger';
import { getCookie } from '../lib/cookieUtils';
import { JWT_COOKIE } from '../constants/userConstants';

export const getApiUrl = (isSocket = false) => {
  let host = process.env.EXTERNAL_API_HOST;
  // When networking with docker, internal docker service fetching should point to internal port
  if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
    logger.debug(`Fetching from Next server using ${host} host`);
    // Host should point to internal service for Next server-side fetch
    host = process.env.INTERNAL_API_HOST;
  }
  if (host.startsWith('http')) {
    if (isSocket) {
      logger.error('Host API_HOST or INTERNAL_API_HOST env variable'
        + 'should not be prefixed with http. Sockets may not work.');
    }
    return host;
  }
  return isSocket ? `ws://${host}` : `http://${host}`;
};

const apiRequest = async (method, endpoint, data, options = {}) => {
  const url = `${getApiUrl()}/rest${endpoint}`;

  const jwtCookie = getCookie(JWT_COOKIE, options.req);
  if (jwtCookie) {
    axios.defaults.headers.common.authorization = `Bearer ${jwtCookie}`;
  } else {
    delete axios.defaults.headers.common.authorization;
  }

  try {
    const response = await axios({
      method,
      url,
      data,
      params: options.params || {},
    });
    if (response?.data?.error) {
      logger.error(response.data.error);
      return {
        error: response.data.uiError,
      };
    }
    return response.data;
  } catch (error) {
    if (error?.response?.data?.error) {
      logger.error(error?.response?.data?.error);
    }
    logger.error(error);
    return {
      error: error?.response?.data?.uiError,
    };
  }
};

export const getRequest = (endpoint, data, options) => apiRequest('GET', endpoint, data, options);
export const postRequest = (endpoint, data, options) => apiRequest('POST', endpoint, data, options);
export const putRequest = (endpoint, data, options) => apiRequest('PUT', endpoint, data, options);
export const deleteRequest = (endpoint, data, options) => apiRequest('DELETE', endpoint, data, options);
