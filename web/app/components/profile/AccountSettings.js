import styled from 'styled-components';
import { connect } from 'react-redux';
import Form from '../modals/common/ModalForm';
import Input from '../modals/common/ModalInput';
import Button from '../modals/common/ModalButton';
import ErrorBanner from '../modals/common/ModalErrorBanner';
import { breakpoints } from '../../lib/styleUtils';
import { CHANGE_PASSWORD } from '../../constants/reducersConstants';
import { submitForm, updateText } from '../../redux/actions/formActions';
import { PASSWORD, PASSWORD_REPEAT } from '../../constants/formConstants';
import { openModal } from '../../redux/actions/modalActions';
import { FORGOT_PASSWORD_MODAL } from '../../constants/modalConstants';

const AccountSettings = ({
  userId,
  apiError,
  apiPending,
  // apiFinished,
  formErrors,
  oldPassword,
  password,
  passwordRepeat,
  passwordValidity,
  passwordRepeatValidity,
  dispatchUpdateText,
  dispatchChangePassword,
  dispatchOpenModal,
}) => {
  const onTextChange = (inputType, value) => {
    dispatchUpdateText(inputType, value);
  };

  const onSubmit = evt => {
    evt.preventDefault();
    dispatchChangePassword({ oldPassword, password, passwordRepeat }, userId);
  };

  const openForgotPasswordModal = () => {
    const fromAccountPage = true;
    dispatchOpenModal(fromAccountPage);
  };

  const isLoading = apiPending && !apiError;

  return (
    <>
      {apiError && <ErrorBanner>{apiError}</ErrorBanner>}
      <Form>
        <Input
          value={oldPassword || ''}
          inputType='oldPassword'
          type='password'
          withLabel='Old password'
          onTextChange={onTextChange}
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
      <ButtonAndStatusContainer>
        <Button
          width='50%'
          type='submit'
          boxShadow={true}
          onClick={onSubmit}
        >
          Change Password
        </Button>
        <OpenForgotModalButton onClick={openForgotPasswordModal}>
          Forgot password
        </OpenForgotModalButton>
      </ButtonAndStatusContainer>
    </>
  );
};

const ButtonAndStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const OpenForgotModalButton = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  background: none;
  text-decoration: underline;
  margin: 1em;
`;

const mapStateToProps = (state = {}) => ({
  apiError: state?.api?.userChangePasswordState?.error,
  apiPending: state?.api?.userChangePasswordState?.pending,
  apiFinished: state?.api?.userChangePasswordState?.finished,
  formErrors: state?.changePassword?.formErrors,
  oldPassword: state?.changePassword?.oldPassword,
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
