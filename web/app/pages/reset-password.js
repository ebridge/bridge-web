import { connect } from 'react-redux';
import styled from 'styled-components';
import PageWrapper from '../components/common/PageWrapper';
import Form from '../components/modals/common/ModalForm';
import Input from '../components/modals/common/ModalInput';
import Button from '../components/modals/common/ModalButton';
import ErrorBanner from '../components/modals/common/ModalErrorBanner';
import { blurInput, submitForm, updateText } from '../redux/actions/formActions';
import { RESET_PASSWORD } from '../constants/reducersConstants';
import { PASSWORD, PASSWORD_REPEAT } from '../constants/formConstants';
import { breakpoints } from '../lib/styleUtils';
import { openModal } from '../redux/actions/modalActions';
import { LOGIN_MODAL } from '../constants/modalConstants';

const ResetPassword = ({
  displayName,
  emailToken,
  apiError,
  apiPending,
  apiFinished,
  formErrors,
  password,
  passwordRepeat,
  passwordValidity,
  passwordRepeatValidity,
  dispatchUpdateText,
  dispatchBlurInput,
  dispatchSubmitForm,
  dispatchOpenModal,
}) => {
  const onTextChange = (inputType, value) => {
    dispatchUpdateText(inputType, value);
  };

  const onBlur = (inputType, value) => {
    dispatchBlurInput(inputType, value, formErrors);
  };

  const onSubmit = evt => {
    evt.preventDefault();
    if (apiPending) return;
    dispatchSubmitForm({ password, passwordRepeat }, emailToken);
  };

  const openLoginModal = () => {
    dispatchOpenModal(LOGIN_MODAL);
  };

  const renderApiError = () => (<ErrorBanner>{apiError}</ErrorBanner>);

  const isLoading = apiPending && !apiError;
  return (
    <PageWrapper displayName={displayName}>
      <h1>Reset Password</h1>
      <FormWrapper>
        <FormContainer>
          {apiError && renderApiError()}
          {apiFinished && !apiError
            ? <>
              <span>Your password has been succesfully set!</span>
              <Button isLoading={isLoading} onClick={openLoginModal}>Login</Button>
            </>
            : <Form>
              <Input
                type='password'
                placeholder='Password'
                value={password}
                inputType={PASSWORD}
                onBlur={onBlur}
                onTextChange={onTextChange}
                validity={passwordValidity}
                error={formErrors[PASSWORD]}
                isLoading={isLoading}
              />
              <Input
                type='password'
                placeholder='Repeat Password'
                value={passwordRepeat}
                inputType={PASSWORD_REPEAT}
                onBlur={onBlur}
                onTextChange={onTextChange}
                validity={passwordRepeatValidity}
                error={formErrors[PASSWORD_REPEAT]}
                isLoading={isLoading}
              />
              <Button type='submit' isLoading={isLoading} onClick={onSubmit}>Reset</Button>
            </Form>}
        </FormContainer>
      </FormWrapper>
    </PageWrapper>
  );
};

ResetPassword.getInitialProps = ({ query }) => ({ emailToken: query.token });

const FormWrapper = styled.div`
  font-size: 1em;
  background: #fff;
  padding: 8px;
  padding-top: 16px;
  border-radius: 2px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;
  ${breakpoints.mobile} {
    width: 100%;
  }
`;

const mapStateToProps = (state = {}) => ({
  apiError: state?.api?.userResetPasswordState?.error,
  apiPending: state?.api?.userResetPasswordState?.pending,
  apiFinished: state?.api?.userResetPasswordState?.finished,
  formErrors: state?.resetPassword?.formErrors,
  password: state?.resetPassword?.password,
  passwordRepeat: state?.resetPassword?.passwordRepeat,
  passwordValidity: state?.resetPassword?.passwordValidity,
  passwordRepeatValidity: state?.resetPassword?.passwordRepeatValidity,
});

const mapDispatchToProps = dispatch => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, RESET_PASSWORD)
  ),
  dispatchBlurInput: (inputType, value, errors) => dispatch(
    blurInput(inputType, value, errors, RESET_PASSWORD)
  ),
  dispatchSubmitForm: (inputFields, token) => dispatch(
    submitForm(inputFields, RESET_PASSWORD, token)
  ),
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
