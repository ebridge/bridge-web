function userView(user) {
  return {
    id: user.id,
    displayName: user.display_name,
    bio: user.bio,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    isBanned: user.is_banned,
    bannedAt: user.banned_at,
  };
}

function userListView(users) {
  return users.map(user => userView(user));
}

module.exports = {
  userView,
  userListView,
};
