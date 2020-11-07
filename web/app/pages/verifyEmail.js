import { useEffect } from 'react';
import { connect } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userVerifyEmail } from '../redux/actions/userActions';

const VerifyEmail = (props, { displayName }) => {
  useEffect(() => {
    const { emailToken, dispatchVerifyEmail } = props;
    if (emailToken) {
      dispatchVerifyEmail(emailToken);
    }
  });
  return (
    <>
      <Navbar
        height='8vh'
        displayName={displayName}
      />
      <h1>Todo: verify email page</h1>
      <Footer height='5vh'>
        <span>&copy; Copyright Ethan Bonsignori 2020</span>
      </Footer>
    </>
  );
};

VerifyEmail.getInitialProps = async ({ query }) => {
  const { emailToken } = query;
  return { emailToken };
};

const mapDispatchToProps = dispatch => ({
  dispatchVerifyEmail: emailToken => dispatch(
    userVerifyEmail(emailToken)
  ),
});

export default connect(null, mapDispatchToProps)(VerifyEmail);
