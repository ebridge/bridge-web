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
  PASSWORD,
  FORM_PENDING,
  FORM_SUBMITTED,
} from '../../constants/formConstants';
import {
  REGISTER_MODAL,
  FORGOT_MODAL,
} from '../../constants/modalConstants';
import { LOGIN } from '../../constants/reducersConstants';

class LoginModal extends React.Component {
  onClose = () => {
    const { dispatchCloseModal } = this.props;
    dispatchCloseModal();
  }

  openRegisterModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(REGISTER_MODAL, { title: 'Register' });
  }

  openForgotModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(FORGOT_MODAL, { title: 'Forgot Password' });
  }


  renderGeneralErrors = () => {
    const { errors = {} } = this.props;
    return (
      <ErrorContainer>
        <span>{errors.general}</span>
      </ErrorContainer>
    );
  }

  onLoginClick = () => {
    const {
      dispatchSubmitForm,
      email,
      password,
    } = this.props;
    dispatchSubmitForm({
      email,
      password,
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
      formStatus,
      errors,
      email,
      password,
      emailValidity,
      passwordValidity,
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
          TODO: Redirect to site
        </>
      );
    }

    return (
      <>
        <Title>{this.props.title}</Title>
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
          type='password'
          placeholder='Password'
          value={password}
          inputType={PASSWORD}
          onBlur={this.onBlur}
          onTextChange={this.onTextChange}
          validity={passwordValidity}
          error={errors[PASSWORD]}
        />
        {errors.general && this.renderGeneralErrors()}
        <Button onClick={this.onLoginClick}>Log In</Button>
        <LinksContainer>
          <button onClick={this.openRegisterModal}>Create an account</button>
          <button onClick={this.openForgotModal}>Forgot your password?</button>
        </LinksContainer>
      </>
    );
  }
}

const mapStateToProps = (state = fromJS({})) => {
  const login = state.get('login');
  return {
    formStatus: login.get('formStatus'),
    errors: login.get('errors'),
    email: login.get('email'),
    password: login.get('password'),
    emailValidity: login.get('emailValidity'),
    passwordValidity: login.get('passwordValidity'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, LOGIN)
  ),
  dispatchBlurInput: (inputType, value, errors) => dispatch(
    blurInput(inputType, value, errors, LOGIN)
  ),
  dispatchSubmitForm: (inputFields) => dispatch(
    submitForm(inputFields, LOGIN)
  ),
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
  dispatchCloseModal: () => dispatch(
    closeModal()
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
