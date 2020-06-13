import cookie from 'js-cookie';

const getCookieFromBrowser = key => (cookie.get(key));

const getCookieFromServer = (key, req) => {
  if (!req?.headers?.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split('=')[1];
};

export const setCookie = (key, value, remember) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: remember ? 1 : 2,
      path: '/',
    });
  }
};

export const removeCookie = key => {
  if (process.browser) {
    cookie.remove(key);
  }
};

export const getCookie = (key, req) => (process.browser
  ? getCookieFromBrowser(key)
  : getCookieFromServer(key, req)
);
