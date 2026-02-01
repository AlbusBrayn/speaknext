import axios from 'axios';
import { L } from '../../utils/logger';


let _accessToken = null;
let _onUnauthorized = null; // Context'ten signOut bağlamak için

export const setAccessToken = (token) => {
  _accessToken = token || null;
  L.at('setAccessToken:', _accessToken ? 'SET' : 'CLEARED');
};
export const getAccessToken = () => _accessToken;

export const bindOnUnauthorized = (fn) => {
  _onUnauthorized = typeof fn === 'function' ? fn : null;
};

const Service = axios.create({
  baseURL: 'https://www.campusnext.app',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

Service.interceptors.request.use(
  (config) => {
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    L.api('→', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

Service.interceptors.response.use(
  (res) => {
    L.api('←', res.status, res.config?.url);
    return res;
  },
  async (error) => {
    if (!error?.response) {
      L.err('← NETWORK/TRANSIENT', error?.message, error?.config?.url);
    } else {
      L.err('←', error?.response?.status, error?.config?.url, error?.response?.data);
    }

    const status = error?.response?.status;
    if (status === 401 && _onUnauthorized) {
      L.auth('401 → signOut()');
      try { await _onUnauthorized(); } catch {}
    }

    return Promise.reject(error);
  }
);

export default Service;
