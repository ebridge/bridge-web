import { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Form from '../modals/common/ModalForm';
import Input from '../modals/common/ModalInput';
import Button from '../modals/common/ModalButton';
import { breakpoints } from '../../lib/styleUtils';
import { CHANGE_PASSWORD } from '../../constants/reducersConstants';
import { submitForm, updateText } from '../../redux/actions/formActions';
import { CURRENT_PASSWORD, PASSWORD, PASSWORD_REPEAT } from '../../constants/formConstants';
import { openModal } from '../../redux/actions/modalActions';
import { FORGOT_PASSWORD_MODAL } from '../../constants/modalConstants';

const AccountSettings = ({
  userId,
  apiError,
  apiPending,
  apiFinished,
  apiMessage,
  formErrors,
  currentPassword,
  password,
  passwordRepeat,
  currentPasswordValidity,
  passwordValidity,
  passwordRepeatValidity,
  dispatchUpdateText,
  dispatchChangePassword,
  dispatchOpenModal,
}) => {
  const [hasUpdated, setHasUpdated] = useState(false);

  const onTextChange = (inputType, value) => {
    dispatchUpdateText(inputType, value);
  };

  const onSubmit = evt => {
    evt.preventDefault();
    dispatchChangePassword({ currentPassword, password, passwordRepeat }, userId);
    return setHasUpdated(true);
  };

  const openForgotPasswordModal = () => {
    const fromAccountPage = true;
    dispatchOpenModal(fromAccountPage);
  };

  const isLoading = apiPending && !apiError;

  const getStatusText = () => {
    if (apiFinished && !apiError) {
      return apiMessage;
    }
    if (isLoading) {
      return 'Loading...';
    }
    if (apiError) {
      return apiError;
    }
    return null;
  };

  return (
    <>
      <Form>
        <StatusText error={apiError}>{hasUpdated && getStatusText()}</StatusText>
        <Input
          value={currentPassword || ''}
          inputType='currentPassword'
          type='password'
          withLabel='Current password'
          onTextChange={onTextChange}
          validity={currentPasswordValidity}
          error={formErrors[CURRENT_PASSWORD]}
          isLoading={isLoading}
        />
        <Input
          value={password || ''}
          inputType='password'
          type='password'
          withLabel='New password'
          onTextChange={onTextChange}
          validity={passwordValidity}
          error={formErrors[PASSWORD]}
          isLoading={isLoading}
        />
        <Input
          value={passwordRepeat || ''}
          inputType='passwordRepeat'
          type='password'
          withLabel='Confirm new password'
          withInfoText={'Use 8 or more characters with a mix of letters, numbers & symbols.'}
          onTextChange={onTextChange}
          validity={passwordRepeatValidity}
          error={formErrors[PASSWORD_REPEAT]}
          isLoading={isLoading}
        />
      </Form>
      <ButtonsContainer>
        <Button
          width='50%'
          type='submit'
          boxShadow={true}
          onClick={onSubmit}
        >
          Change Password
        </Button>
        <OpenModalButton onClick={openForgotPasswordModal}>Forgot password</OpenModalButton>

      </ButtonsContainer>
    </>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  flex-wrap: wrap;

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const OpenModalButton = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  background: none;
  text-decoration: underline;
  margin-left: 0.5em;
`;

const StatusText = styled.div`
  color: ${({ error }) => (error ? 'red' : 'green')};
  width: 100%;
  text-align: left;
  font-weight: bold;

  ${breakpoints.mobile} {
    text-align: center;
  }
`;

const mapStateToProps = (state = {}) => ({
  apiError: state?.api?.userChangePasswordState?.error,
  apiPending: state?.api?.userChangePasswordState?.pending,
  apiFinished: state?.api?.userChangePasswordState?.finished,
  apiMessage: state?.api?.userChangePasswordState?.message,
  formErrors: state?.changePassword?.formErrors,
  currentPassword: state?.changePassword?.currentPassword,
  password: state?.changePassword?.password,
  passwordRepeat: state?.changePassword?.passwordRepeat,
  passwordValidity: state?.changePassword?.passwordValidity,
  passwordRepeatValidity: state?.changePassword?.passwordRepeatValidity,
});

const mapDispatchToProps = dispatch => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, CHANGE_PASSWORD)
  ),
  dispatchChangePassword: (inputFields, userId) => dispatch(
    submitForm(inputFields, CHANGE_PASSWORD, userId)
  ),
  dispatchOpenModal: fromAccountPage => dispatch(
    openModal(FORGOT_PASSWORD_MODAL, { fromAccountPage })
  ),
});


export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
