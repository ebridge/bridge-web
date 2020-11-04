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
  LOGIN_MODAL,
  REGISTER_MODAL,
} from '../../constants/modalConstants';
import { FORGOT } from '../../constants/reducersConstants';

class ForgotModal extends React.Component {
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


  renderApiError = () => {
    const { apiError } = this.props;
    return (
      <ErrorBanner>{apiError}</ErrorBanner>
    );
  }


  onForgotClick = evt => {
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
      formErrors,
      email,
      emailValidity,
    } = this.props;

    const isLoading = apiPending && !apiError;
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
          <Button isLoading={isLoading} onClick={this.onSubmit}>Send me a Link</Button>
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
  apiError: state?.api?.userForgotPasswordState?.error,
  apiPending: state?.api?.userForgotPasswordState?.pending,
  formErrors: state?.forgot?.formErrors,
  email: state?.forgot?.email,
  emailValidity: state?.forgot?.emailValidity,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, FORGOT)
  ),
  dispatchBlurInput: (inputType, value, errors) => dispatch(
    blurInput(inputType, value, errors, FORGOT)
  ),
  dispatchSubmitForm: (inputFields) => dispatch(
    submitForm(inputFields, FORGOT)
  ),
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
  dispatchCloseModal: () => dispatch(
    closeModal()
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotModal);
