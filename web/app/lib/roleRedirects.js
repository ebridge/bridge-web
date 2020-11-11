import Router from 'next/router';
import permissions from '../constants/permissions';

const acceptableRoutes = ['/', '/verifyEmail'];

function redirect(res, route) {
  if (res) {
    res.writeHead(302, {
      Location: route,
      'Content-Type': 'text/html; charset=utf-8',
    });
    return res.end();
  }

  return Router.push(route);
}

export default function checkUserPermsAndRoute(res, pathname, role, verified) {
  if (acceptableRoutes.includes(pathname)) {
    return null;
  }
  if (!role) {
    return redirect(res, '/');
  }
  if (!verified) {
    return redirect(res, '/verifyEmail?emailToken=verify');
  }

  if (!permissions[role].includes(pathname)) {
    return redirect(res, '/');
  }

  return null;
}
