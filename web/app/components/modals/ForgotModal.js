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
    dispatchOpenModal(LOGIN_MODAL, { title: 'Login' });
  }

  openRegisterModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(REGISTER_MODAL, { title: 'Register' });
  }


  renderApiErrors = () => {
    const { apiErrors } = this.props;
    return (
      <ErrorContainer>
        <span>{apiErrors}</span>
      </ErrorContainer>
    );
  }


  onForgotClick = () => {
    const {
      dispatchSubmitForm,
      email,
    } = this.props;
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
      apiErrors,
      formErrors,
      title,
      email,
      emailValidity,
    } = this.props;

    return (
      <>
        <Title>{title}</Title>
        {apiErrors && this.renderApiErrors()}
        <Input
          type='email'
          placeholder='Enter your email'
          value={email}
          inputType={EMAIL}
          onBlur={this.onBlur}
          onTextChange={this.onTextChange}
          validity={emailValidity}
          error={formErrors[EMAIL]}
        />
        <Button onClick={this.onForgotClick}>Send me a Link</Button>
        <LinksContainer>
          <button onClick={this.openLoginModal}>Remembered your account? Log in</button>
          <button onClick={this.openRegisterModal}>Create an account</button>
        </LinksContainer>
      </>
    );
  }
}

const mapStateToProps = (state = fromJS({})) => {
  const api = state.get('api');
  const forgot = state.get('forgot');
  return {
    apiErrors: api.get('USER_FORGOT_PASSWORD_STATE').error,
    formErrors: forgot.get('formErrors'),
    email: forgot.get('email'),
    emailValidity: forgot.get('emailValidity'),
  };
};

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
