import axios from 'axios';
import logger from '../lib/logger';
import { getCookie } from '../lib/cookieUtils';
import { JWT_COOKIE } from '../constants/userConstants';

// import loginActions from './actions/loginActions';
const getApiUrl = () => {
  // When networking with docker, client-side fetching can't resolve docker-compose link aliases
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    logger.debug(`Fetching from client using ${process.env.LOCAL_API_HOST} host`);
    return process.env.LOCAL_API_HOST; // API_HOST will point to localhost port exposed by docker
  }
  logger.debug(`Fetching from server using ${process.env.API_HOST} host`);
  return process.env.API_HOST;
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
