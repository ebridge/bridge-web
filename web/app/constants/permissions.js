// Routes any user can hit, whether or not they're verified or logged in
export const freeRealEstate = [
  '/',
  '/verify-email',
  '/reset-password',
];

// Routes that require email verification and "free" role or above
const baseRoutes = [
  ...freeRealEstate,
  '/login',
  '/register',
  '/dashboard',
  '/user/profile',
  '/user/[userId]',
  '/room/[roomId]',
];

export default {
  admin: [...baseRoutes],
  moderator: [...baseRoutes],
  subscriber: [...baseRoutes],
  free: baseRoutes,
};
