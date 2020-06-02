import axios from 'axios';
import Cookies from 'js-cookie';
import logger from '../lib/logger';
import { JWT_COOKIE } from '../constants/userConstants';

// import loginActions from './actions/loginActions';
const getApiUrl = () => {
  // When networking with docker, client-side fetching can't resolve docker-compose link aliases
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    logger.debug(`Fetching from client using ${process.env.LOCAL_API_HOST} host`);
    return process.env.LOCAL_API_HOST; // LOCAL_GRAPH_HOST will point to localhost port exposed by docker
  }
  logger.debug(`Fetching from server using ${process.env.GRAPH_HOST} host`);
  return process.env.API_HOST;
};

const apiRequest = async (method, endpoint, data, params = {}) => {
  const url = `${getApiUrl()}/rest${endpoint}`;
  const jwtCookie = Cookies.get(JWT_COOKIE);
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
      params,
    });
    if (response?.data?.error) {
      logger.error(response.data.error);
      return {
        error: response.data.uiError,
      };
    }
    return response.data;
  } catch (error) {
    logger.error(error?.response?.data?.error);
    return {
      error: error?.response?.data?.uiError,
    };
  }
};

export const getRequest = (endpoint, data, params) => apiRequest('GET', endpoint, data, params);
export const postRequest = (endpoint, data, params) => apiRequest('POST', endpoint, data, params);
export const putRequest = (endpoint, data, params) => apiRequest('PUT', endpoint, data, params);
export const deleteRequest = (endpoint, data, params) => apiRequest('DELETE', endpoint, data, params);
