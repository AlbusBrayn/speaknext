// src/utils/logger.js
const passthrough = (...a) => console.log(...a);

export const L =
  __DEV__
    ? {
        auth: (...a) => console.log('[AUTH]', ...a),
        rt:   (...a) => console.log('[RT]', ...a),
        at:   (...a) => console.log('[AT]', ...a),
        api:  (...a) => console.log('[API]', ...a),
        st:   (...a) => console.log('[STATUS]', ...a),
        prog: (...a) => console.log('[PROGRESS]', ...a),
        ob:   (...a) => console.log('[ONBOARDING]', ...a),
        nav:  (...a) => console.log('[NAV]', ...a),
        err:  (...a) => console.log('[ERR]', ...a),
      }
    : {
        // Prod'da istersen sessize al (veya Sentry’ye gönder)
        auth: passthrough,
        rt:   passthrough,
        at:   passthrough,
        api:  passthrough,
        st:   passthrough,
        prog: passthrough,
        ob:   passthrough,
        nav:  passthrough,
        err:  passthrough,
      };
