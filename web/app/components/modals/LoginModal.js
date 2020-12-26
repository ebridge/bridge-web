import React from 'react';
import { connect } from 'react-redux';
import Title from './common/ModalTitle';
import Form from './common/ModalForm';
import Input from './common/ModalInput';
import Button from './common/ModalButton';
import Checkbox from './common/ModalCheckbox';
import LinksContainer from './common/ModalLinksContainer';
import ModalLink from './common/ModalLink';
import ErrorBanner from './common/ModalErrorBanner';
import {
  updateText,
  updateCheckbox,
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
  REMEMBER,
} from '../../constants/formConstants';
import {
  REGISTER_MODAL,
  FORGOT_PASSWORD_MODAL,
} from '../../constants/modalConstants';
import { LOGIN } from '../../constants/reducersConstants';

class LoginModal extends React.Component {
  onClose = () => {
    const { dispatchCloseModal } = this.props;
    dispatchCloseModal();
  }

  openRegisterModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(REGISTER_MODAL);
  }

  openForgotModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(FORGOT_PASSWORD_MODAL);
  }

  renderApiError = () => {
    const { apiError } = this.props;
    return (
      <ErrorBanner>{apiError}</ErrorBanner>
    );
  }

  handleSubmit = evt => {
    evt.preventDefault();
    const {
      apiPending,
      dispatchSubmitForm,
      email,
      password,
      remember,
    } = this.props;
    if (apiPending) return;
    if (remember) {
      localStorage.setItem('email', email);
      localStorage.setItem('remember', true);
    }
    dispatchSubmitForm({
      email,
      password,
      remember,
    });
  }

  componentDidMount = () => {
    if (localStorage) {
      const email = localStorage.getItem('email');
      const remember = localStorage.getItem('remember');
      if (!email) return;
      this.onTextChange('email', email);
      if (!remember) return;
      this.onCheckboxChange('remember', !!remember);
    }
  }

  onTextChange = (inputType, value) => {
    const { dispatchUpdateText } = this.props;
    dispatchUpdateText(inputType, value);
  }

  onCheckboxChange = (inputType, value) => {
    // Value is event.target.checked boolean
    const { dispatchUpdateCheckbox } = this.props;
    dispatchUpdateCheckbox(inputType, value);
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
      password,
      remember,
      emailValidity,
      passwordValidity,
    } = this.props;

    const isLoading = apiPending && !apiError;
    return (
      <>
        <Title>Login</Title>
        {apiError && this.renderApiError()}
        <Form onSubmit={this.handleSubmit}>
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
            type='password'
            placeholder='Password'
            hideTogglePassword={true}
            value={password}
            inputType={PASSWORD}
            onBlur={this.onBlur}
            onTextChange={this.onTextChange}
            validity={passwordValidity}
            error={formErrors[PASSWORD]}
            isLoading={isLoading}
          />
          <Button
            type='submit'
            onClick={this.handleSubmit}
            isLoading={isLoading}
          >
            Log in
          </Button>
          <Checkbox
            type='checkbox'
            label='Remember me'
            inputType={REMEMBER}
            onChange={this.onCheckboxChange}
            checked={remember}
          />
        </Form>
        <LinksContainer>
          <ModalLink onClick={this.openRegisterModal}>Create an account</ModalLink>
          <ModalLink onClick={this.openForgotModal}>Forgot your password?</ModalLink>
        </LinksContainer>
      </>
    );
  }
}

const mapStateToProps = (state = {}) => ({
  apiError: state?.api?.userLoginState?.error,
  apiPending: state?.api?.userLoginState?.pending,
  formErrors: state?.login?.formErrors,
  email: state?.login?.email,
  password: state?.login?.password,
  remember: state?.login?.remember,
  emailValidity: state?.login?.emailValidity,
  passwordValidity: state?.login?.passwordValidity,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, LOGIN)
  ),
  dispatchUpdateCheckbox: (inputType, value) => dispatch(
    updateCheckbox(inputType, value, LOGIN)
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
