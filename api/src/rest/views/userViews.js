function userView(user) {
  return {
    id: user.id,
    role: user.role,
    email: user.email,
    emailConfirmed: user.email_confirmed,
    displayName: user.display_name,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    isBanned: user.is_banned,
    bannedAt: user.banned_at,
    profile: {
      name: user.name,
      profilePictureUrl: user.profile_picture_url,
      birthDate: user.birth_date,
      birthDateIsPrivate: user.birth_date_is_private,
      bio: user.bio,
      conventions: user.conventions,
      location: user.location,
    },
  };
}

function userListView(users) {
  return users.map(user => userView(user));
}

module.exports = {
  userView,
  userListView,
};
