import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import Title from './ModalTitle';
import Input from './ModalInput';
import Button from './ModalButton';
import LinksContainer from './ModalLinksContainer';
import ErrorContainer from './ModalErrorContainer';
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
  FORM_PENDING,
  FORM_SUBMITTED,
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
    dispatchOpenModal(LOGIN_MODAL, { title: 'Login' });
  }

  renderGeneralErrors = () => {
    const { errors = {} } = this.props;
    if (!errors.general || !errors.general.length) {
      return null;
    }
    return (
      <ErrorContainer>
        <span>{errors.general}</span>
      </ErrorContainer>
    );
  }

  onRegisterClick = () => {
    const {
      dispatchSubmitForm,
      email,
      displayName,
      password,
      passwordRepeat,
    } = this.props;
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
    const { dispatchBlurInput, errors } = this.props;
    dispatchBlurInput(inputType, value, errors);
  }

  render() {
    const {
      title,
      formStatus,
      errors,
      email,
      displayName,
      password,
      passwordRepeat,
      emailValidity,
      displayNameValidity,
      passwordValidity,
      passwordRepeatValidity,
    } = this.props;

    if (formStatus === FORM_PENDING) {
      return (
        <>
          TODO: Loading / pending
        </>
      );
    }

    if (formStatus === FORM_SUBMITTED) {
      return (
        <>
          TODO: Submitted please confirm your email address.
        </>
      );
    }

    return (
      <>
        <Title>{title}</Title>
        <Input
          type='email'
          placeholder='Email'
          value={email}
          inputType={EMAIL}
          onBlur={this.onBlur}
          onTextChange={this.onTextChange}
          validity={emailValidity}
          error={errors[EMAIL]}
        />
        <Input
          type='text'
          placeholder='Display Name'
          value={displayName}
          inputType={DISPLAY_NAME}
          onBlur={this.onBlur}
          onTextChange={this.onTextChange}
          validity={displayNameValidity}
          error={errors[DISPLAY_NAME]}
        />
        <Input
          type='password'
          placeholder='Password'
          value={password}
          inputType={PASSWORD}
          onBlur={this.onBlur}
          onTextChange={this.onTextChange}
          validity={passwordValidity}
          error={errors[PASSWORD]}
        />
        <Input
          type='password'
          placeholder='Repeat Password'
          value={passwordRepeat}
          inputType={PASSWORD_REPEAT}
          onBlur={this.onBlur}
          onTextChange={this.onTextChange}
          validity={passwordRepeatValidity}
          error={errors[PASSWORD_REPEAT]}
        />
        <Button onClick={this.onRegisterClick}>Register</Button>
        <LinksContainer>
          <button onClick={this.openLoginModal}>
            Already have an account? Log in
          </button>
        </LinksContainer>
        {this.renderGeneralErrors}
      </>
    );
  }
}

const mapStateToProps = (state = fromJS({})) => {
  const register = state.get('register');
  return {
    formStatus: register.get('formStatus'),
    errors: register.get('errors'),
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
