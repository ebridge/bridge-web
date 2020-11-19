import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';
import PageWrapper from '../components/common/PageWrapper';
import ModalButton from '../components/modals/common/ModalButton';
import { userVerifyEmail, userSendVerifyEmail } from '../redux/actions/userActions';
import { breakpoints } from '../lib/styleUtils';
import { openModal } from '../redux/actions/modalActions';
import { LOGIN_MODAL } from '../constants/modalConstants';

const VerifyEmail = props => {
  const {
    emailToken,
    dispatchVerifyEmail,
    dispatchSendVerifyEmail,
    dispatchOpenModal,
    displayName,
    emailConfirmed,
    userVerifyEmailState,
    userSendVerifyEmailState,
  } = props;

  const [buttonState, setButtonState] = useState('unverified');

  const goToDashboard = () => {
    Router.push('/dashboard');
  };

  const openLoginModal = () => {
    dispatchOpenModal();
  };

  const sendVerifyEmail = () => {
    dispatchSendVerifyEmail();
  };

  useEffect(() => {
    if (!emailConfirmed && emailToken !== 'verify') {
      dispatchVerifyEmail(emailToken);
    }
  }, []);

  if (buttonState !== 'verified' && emailConfirmed) {
    setButtonState('verified');
  } else if (buttonState !== 'verified' && userVerifyEmailState.finished) {
    setButtonState('verified');
  } else if (buttonState !== 'pending' && userSendVerifyEmailState.pending) {
    setButtonState('pending');
  } else if (buttonState !== 'sent' && userSendVerifyEmailState.finished) {
    setButtonState('sent');
  }


  let verifySpan = <>
    <span>Please verify your email address to continue.</span>
    <br />
    <span>Check your email for a verification email or press the button below to resend verification email.</span>
  </>;
  let verifyButton;

  switch (buttonState) {
  case 'unverified':
    verifyButton = <ModalButton onClick={sendVerifyEmail}>Resend Email</ModalButton>;
    break;
  case 'pending':
    verifyButton = <ModalButton isLoading />;
    break;
  case 'sent':
    verifySpan = 'Please check your email for a verification email.';
    verifyButton = <ModalButton disabled>Sent!</ModalButton>;
    break;
  case 'verified':
  default:
    verifySpan = 'Your email is verified.';
    verifyButton = displayName
      ? <ModalButton onClick={goToDashboard}>Go to Dashboard</ModalButton>
      : <ModalButton onClick={openLoginModal}>Login</ModalButton>;
  }

  return (
    <PageWrapper displayName={displayName}>
      <h1>Verify Email Address</h1>
      <ContentContainer unverified={emailConfirmed}>
        {verifySpan}
        <ButtonContainer>
          {verifyButton}
        </ButtonContainer>
      </ContentContainer>
    </PageWrapper>
  );
};

VerifyEmail.getInitialProps = async ({ query }) => ({ emailToken: query.token });

const ButtonContainer = styled.div`
  width: 25%;

  ${breakpoints.mobile} {
    width: 75%;
  }
`;

const ContentContainer = styled.div`
  font-size: 1.4em;
  background: #fff;
  padding: 8px;
  padding-top: 16px;
  border-radius: 2px;
  border-left: ${({ unverified }) => (unverified ? '2px solid #4bc970' : '2px solid #cd0000')};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const mapStateToProps = (state = {}) => ({
  userSendVerifyEmailState: state.api.userSendVerifyEmailState,
  userVerifyEmailState: state.api.userVerifyEmailState,
});

const mapDispatchToProps = dispatch => ({
  dispatchVerifyEmail: emailToken => dispatch(
    userVerifyEmail(emailToken)
  ),
  dispatchSendVerifyEmail: () => dispatch(
    userSendVerifyEmail()
  ),
  dispatchOpenModal: () => dispatch(
    openModal(LOGIN_MODAL)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
