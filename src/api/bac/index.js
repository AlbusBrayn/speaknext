import axios from 'axios';
import { L } from '../../utils/logger';


let _accessToken = null;
let _onUnauthorized = null; // Context'ten signOut bağlamak için
let _refreshingPromise = null; // mutex

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
    const code   = error?.response?.data?.code;
    const originalConfig = error?.config || {};
    const originalUrl = String(originalConfig?.url || '');

    // 🔒 refresh endpoint'inde 401 alıyorsak tekrar refresh denemeyelim
    const isRefreshEndpoint = /\/auth\/refresh(\?|$)/.test(originalUrl);

    const isExpired = status === 401 && code === 'token_expired';

    if (isExpired && !isRefreshEndpoint) {
           L.rt('token expired → refreshing…');

      if (!_refreshingPromise) {
        _refreshingPromise = (async () => {
          try {
            const { refreshToken } = await import('./authservice');
            const data = await refreshToken(); // { access_token, refresh_token? }
            if (!data?.access_token) throw new Error('refresh_no_access_token');
            setAccessToken(data.access_token);
            L.rt('refresh OK, new AT set');
          } catch (e) {
            L.err('refresh FAILED', e?.response?.status, e?.message);
            if (_onUnauthorized) {
              try { await _onUnauthorized(); } catch {}
            }
            throw e;
          } finally {
            _refreshingPromise = null;
          }
        })();
      }

      await _refreshingPromise;

      const cfg = { ...originalConfig };
      cfg.headers = cfg.headers || {};
      L.rt('retrying original request:', cfg.url);
      if (cfg._retried) return Promise.reject(error); // ✅ loop guard
      cfg._retried = true;
      if (_accessToken) {
        cfg.headers.Authorization = `Bearer ${_accessToken}`;
        return Service.request(cfg);
      }
      return Promise.reject(error);
    }


    // Diğer 401 tipleri (invalid/revoked vb.) → direkt signOut
    if (status === 401 && !isRefreshEndpoint) {
      L.auth('401 (non-expired) → signOut()');
      if (_onUnauthorized) {
        try { await _onUnauthorized(); } catch {}
      }
    }

    return Promise.reject(error);
  }
);

export default Service;
