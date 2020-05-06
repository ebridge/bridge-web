import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import Title from './ModalTitle'
import Input from './ModalInput';
import Button from './ModalButton';
import LinksContainer from './ModalLinksContainer'
import ErrorContainer from './ModalErrorContainer'
import {
  updateText,
  submitForm,
  blurInput,
} from '../../redux/actions/formActions';
import {
  openModal,
  closeModal
} from '../../redux/actions/modalActions'
import {
  EMAIL,
  FORM_PENDING,
  FORM_SUBMITTED,
} from '../../constants/formConstants';
import {
  LOGIN_MODAL,
  REGISTER_MODAL
} from '../../constants/modalConstants';
import { FORGOT } from '../../constants/reducersConstants';

class ForgotModal extends React.Component {
  constructor(props) {
    super(props);
  }

  onClose = () => {
    const { dispatchCloseModal } = this.props
    dispatchCloseModal()
  }

  openLoginModal = () => {
    const { dispatchOpenModal } = this.props
    dispatchOpenModal(LOGIN_MODAL, { title: 'Login' })
  }

  openRegisterModal = () => {
    const { dispatchOpenModal } = this.props
    dispatchOpenModal(REGISTER_MODAL, { title: 'Register' })
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


  onForgotClick = () => {
    const { dispatchSubmitForm, email } = this.props;
    dispatchSubmitForm({ email });
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
      emailValidity,
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
          <span>If {email} matches an account in our database you will receive an email with a link to reset your password.</span>
        </>
      );
    }
    return (
      <>
        <Title>{title}</Title>
        <Input
          type='email'
          placeholder='Enter your email'
          value={email}
          inputType={EMAIL}
          onBlur={this.onBlur}
          onTextChange={this.onTextChange}
          validity={emailValidity}
          error={errors[EMAIL]}
        />
        <Button onClick={this.onForgotClick}>Send me a Link</Button>
        <LinksContainer>
          <button onClick={this.openLoginModal}>Remembered your account? Log in</button>
          <button onClick={this.openRegisterModal}>Create an account</button>
        </LinksContainer>
        {this.renderGeneralErrors}
      </>
    );
  }
}

const mapStateToProps = (state = fromJS({})) => {
  const forgot = state.get('forgot');
  return {
    formStatus: forgot.get('formStatus'),
    errors: forgot.get('errors'),
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
