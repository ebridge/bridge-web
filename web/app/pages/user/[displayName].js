import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { userGetProfile, userUpdateProfile } from '../../redux/actions/userActions';

const Profile = ({ profile }) => <p>Profile: {profile}</p>;

Profile.getInitialProps = async (ctx) => {
  const { displayName } = ctx.query;
  userGetProfile(displayName);
};

const mapStateToProps = (state = fromJS({})) => {
  const api = state.get('api');
  const user = state.get('user');
  return {
    apiError: api.get('userGetProfileState').error,
    profile: user.get('profile'),
  };
};

const mapDispatchToProps = dispatch => ({
  dispatchUserUpdateProfile: (profile) => dispatch(
    userUpdateProfile(profile)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
