import React from 'react';
import { connect } from 'react-redux';
import Title from './common/ModalTitle';
import Form from './common/ModalForm';
import Input from './common/ModalInput';
import Button from './common/ModalButton';
import LinksContainer from './common/ModalLinksContainer';
import ModalLink from './common/ModalLink';
import ErrorBanner from './common/ModalErrorBanner';
import {
  updateText,
  submitForm,
  blurInput,
} from '../../redux/actions/formActions';
import {
  openModal,
  closeModal,
} from '../../redux/actions/modalActions';
import { EMAIL } from '../../constants/formConstants';
import {
  EMAIL_SENT_MODAL,
  LOGIN_MODAL,
  REGISTER_MODAL,
} from '../../constants/modalConstants';
import { FORGOT_PASSWORD } from '../../constants/reducersConstants';

class ForgotPasswordModal extends React.Component {
  onClose = () => {
    const { dispatchCloseModal } = this.props;
    dispatchCloseModal();
  }

  openLoginModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(LOGIN_MODAL);
  }

  openRegisterModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(REGISTER_MODAL);
  }

  openEmailSentModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(EMAIL_SENT_MODAL, { from: FORGOT_PASSWORD });
  }

  renderApiError = () => {
    const { apiError } = this.props;
    return (
      <ErrorBanner>{apiError}</ErrorBanner>
    );
  }

  onSubmit = evt => {
    evt.preventDefault();
    const {
      apiPending,
      dispatchSubmitForm,
      email,
    } = this.props;
    if (apiPending) return;
    dispatchSubmitForm({ email });
  }

  onTextChange = (inputType, value) => {
    const { dispatchUpdateText } = this.props;
    dispatchUpdateText(inputType, value);
  }

  onBlur = (inputType, value) => {
    const { dispatchBlurInput, formErrors } = this.props;
    dispatchBlurInput(inputType, value, formErrors);
  }

  render() {
    const {
      apiError,
      apiPending,
      apiFinsihed,
      formErrors,
      email,
      emailValidity,
    } = this.props;

    const isLoading = apiPending && !apiError;
    if (apiFinsihed && !apiError) {
      this.openEmailSentModal();
    }
    return (
      <>
        <Title>Forgot Password</Title>
        {apiError && this.renderApiError()}
        <Form onSubmit={this.onSubmit}>
          <Input
            type='email'
            placeholder='Enter your email'
            value={email}
            inputType={EMAIL}
            onBlur={this.onBlur}
            onTextChange={this.onTextChange}
            validity={emailValidity}
            error={formErrors[EMAIL]}
            isLoading={isLoading}
          />
          <Button isLoading={isLoading} onClick={this.onSubmit}>Send Me a Link</Button>
        </Form>
        <LinksContainer>
          <ModalLink onClick={this.openLoginModal}>Remembered your account? Log in</ModalLink>
          <ModalLink onClick={this.openRegisterModal}>Create an account</ModalLink>
        </LinksContainer>
      </>
    );
  }
}

const mapStateToProps = (state = {}) => ({
  apiError: state?.api?.userSendResetPasswordEmailState?.error,
  apiPending: state?.api?.userSendResetPasswordEmailState?.pending,
  apiFinsihed: state?.api?.userSendResetPasswordEmailState?.finished,
  formErrors: state?.forgotPassword?.formErrors,
  email: state?.forgotPassword?.email,
  emailValidity: state?.forgotPassword?.emailValidity,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, FORGOT_PASSWORD)
  ),
  dispatchBlurInput: (inputType, value, errors) => dispatch(
    blurInput(inputType, value, errors, FORGOT_PASSWORD)
  ),
  dispatchSubmitForm: (inputFields) => dispatch(
    submitForm(inputFields, FORGOT_PASSWORD)
  ),
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
  dispatchCloseModal: () => dispatch(
    closeModal()
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordModal);
