import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
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
import {
  EMAIL,
  DISPLAY_NAME,
  PASSWORD,
  PASSWORD_REPEAT,
} from '../../constants/formConstants';
import { LOGIN_MODAL } from '../../constants/modalConstants';
import { REGISTER } from '../../constants/reducersConstants';

class RegisterModal extends React.Component {
  onClose = () => {
    const { dispatchCloseModal } = this.props;
    dispatchCloseModal();
  }

  openLoginModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(LOGIN_MODAL);
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
      displayName,
      password,
      passwordRepeat,
    } = this.props;
    if (apiPending) return;
    dispatchSubmitForm({
      email,
      displayName,
      password,
      passwordRepeat,
    });
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
      displayName,
      password,
      passwordRepeat,
      emailValidity,
      displayNameValidity,
      passwordValidity,
      passwordRepeatValidity,
    } = this.props;

    const isLoading = apiPending && !apiError;
    return (
      <>
        <Title>Register</Title>
        {apiError && this.renderApiError()}
        <Form onSubmit={this.onSubmit}>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            inputType={EMAIL}
            onBlur={this.onBlur}
            onTextChange={this.onTextChange}
            validity={emailValidity}
            error={formErrors[EMAIL]}
            isLoading={isLoading}
          />
          <Input
            type='text'
            placeholder='Display Name'
            value={displayName}
            inputType={DISPLAY_NAME}
            onBlur={this.onBlur}
            onTextChange={this.onTextChange}
            validity={displayNameValidity}
            error={formErrors[DISPLAY_NAME]}
            isLoading={isLoading}
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            inputType={PASSWORD}
            onBlur={this.onBlur}
            onTextChange={this.onTextChange}
            validity={passwordValidity}
            error={formErrors[PASSWORD]}
            isLoading={isLoading}
          />
          <Input
            type='password'
            placeholder='Repeat Password'
            value={passwordRepeat}
            inputType={PASSWORD_REPEAT}
            onBlur={this.onBlur}
            onTextChange={this.onTextChange}
            validity={passwordRepeatValidity}
            error={formErrors[PASSWORD_REPEAT]}
            isLoading={isLoading}
          />
          <Button isLoading={isLoading} onClick={this.onSubmit}>Register</Button>
        </Form>
        <LinksContainer>
          <ModalLink onClick={this.openLoginModal}>Already have an account? Log in</ModalLink>
        </LinksContainer>
      </>
    );
  }
}

const mapStateToProps = (state = fromJS({})) => {
  const api = state.get('api');
  const register = state.get('register');
  return {
    apiError: api.get('userRegisterState').error,
    apiPending: api.get('userRegisterState').pending,
    formErrors: register.get('formErrors'),
    email: register.get('email'),
    displayName: register.get('displayName'),
    password: register.get('password'),
    passwordRepeat: register.get('passwordRepeat'),
    emailValidity: register.get('emailValidity'),
    displayNameValidity: register.get('displayNameValidity'),
    passwordValidity: register.get('passwordValidity'),
    passwordRepeatValidity: register.get('passwordRepeatValidity'),
  };
};

const mapDispatchToProps = dispatch => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, REGISTER)
  ),
  dispatchBlurInput: (inputType, value, errors) => dispatch(
    blurInput(inputType, value, errors, REGISTER)
  ),
  dispatchSubmitForm: (inputFields) => dispatch(
    submitForm(inputFields, REGISTER)
  ),
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
  dispatchCloseModal: () => dispatch(
    closeModal()
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterModal);
