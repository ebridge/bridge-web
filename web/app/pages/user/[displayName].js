import { useState } from 'react';
import { connect } from 'react-redux';
import { getRequest } from '../../redux/service';
import { userUpdateProfile } from '../../redux/actions/userActions';
import { objKeysToCamel } from '../../lib/utils';

const Profile = ({
  userProfile,
  error,
  dispatchUserUpdateProfile,
}) => {
  const [profile, setUserProfile] = useState(userProfile);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = evt => {
    const { name, value } = evt.target;
    setEditedProfile(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const updatedProfile = await dispatchUserUpdateProfile(userProfile.displayName, editedProfile);
    setUserProfile(updatedProfile);
    return setIsEditing(false);
  };

  const {
    displayName,
    bio,
    createdAt,
    updatedAt,
    isBanned,
    bannedAt,
  } = profile;
  // TODO: Style profile and display profile data
  return (
    <>
      <div>
        <h1>User Profile</h1>
        <ul>
          <li>Display Name: {displayName}</li>
          <li>Created: {createdAt}</li>
          <li>Updated: {updatedAt}</li>
          {!isBanned ? <li> This user is banned! They were banned: {bannedAt}</li> : null}
          {isEditing
            ? <li>
              <textarea name='bio' value={editedProfile.bio || ''} onChange={handleChange}></textarea>
              <button onClick={handleSave}>Save</button>
            </li>
            : <li>Bio: {bio || 'There\'s nothing here.'} <button onClick={() => setIsEditing(true)}>Edit</button></li>}
          {error && <li>{error}</li>}
        </ul>
      </div>
    </>
  );
};

Profile.getInitialProps = async (ctx) => {
  const { displayName } = ctx.query;
  const response = await getRequest(`/users/${displayName}`);
  if (response.error) {
    return {
      error: response?.error,
      userProfile: null,
    };
  }
  const { user } = response;
  const userProfile = objKeysToCamel(user);
  return {
    error: null,
    userProfile,
  };
};

const mapStateToProps = (state = {}) => ({
  updatedProfile: state?.user?.updatedProfile,
});

const mapDispatchToProps = dispatch => ({
  dispatchUserUpdateProfile: (displayName, profile) => dispatch(
    userUpdateProfile(displayName, profile)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
