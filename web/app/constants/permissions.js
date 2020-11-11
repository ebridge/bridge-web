
const baseRoutes = ['/', '/verifyEmail', '/login', '/register', '/dashboard', '/room/[roomId]'];

export default {
  admin: [...baseRoutes],
  moderator: [...baseRoutes],
  subscriber: [...baseRoutes],
  free: baseRoutes,
};
