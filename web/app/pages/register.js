import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { updateText, submitForm, blurInput } from '../redux/actions/formActions';
import LandingLayout from '../components/landing/layout';
import LandingModal from '../components/landing/modal';
import LandingModalLinks from '../components/landing/modalLinks';
import LandingInput from '../components/landing/input';
import LandingButton from '../components/landing/button';
import ErrorContainer from '../components/landing/errorContainer';
import {
  EMAIL,
  DISPLAY_NAME,
  PASSWORD,
  PASSWORD_REPEAT,
  FORM_PENDING,
  FORM_SUBMITTED,
} from '../constants/formConstants';
import { REGISTER } from '../constants/reducersConstants';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.renderGeneralErrors = this.renderGeneralErrors.bind(this);
    this.onRegisterClick = this.onRegisterClick.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  renderGeneralErrors() {
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

  onRegisterClick() {
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

  onTextChange(inputType, value) {
    const { dispatchUpdateText } = this.props;
    dispatchUpdateText(inputType, value);
  }

  onBlur(inputType, value) {
    const { dispatchBlurInput, errors } = this.props;
    dispatchBlurInput(inputType, value, errors);
  }

  render() {
    const {
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
        <LandingLayout>
          <LandingModal title='Sign up'>
          TODO: Loading / pending
          </LandingModal>
        </LandingLayout>
      );
    }

    if (formStatus === FORM_SUBMITTED) {
      return (
        <LandingLayout>
          <LandingModal title='Sign up'>
          TODO: Submitted please confirm your email address.
          </LandingModal>
        </LandingLayout>
      );
    }

    return (
      <LandingLayout>
        <LandingModal title='Sign up'>
          <LandingInput
            type='email'
            placeholder='Email'
            value={email}
            inputType={EMAIL}
            onBlur={this.onBlur}
            onTextChange={this.onTextChange}
            validity={emailValidity}
            error={errors[EMAIL]}
          />
          <LandingInput
            type='text'
            placeholder='Display Name'
            value={displayName}
            inputType={DISPLAY_NAME}
            onBlur={this.onBlur}
            onTextChange={this.onTextChange}
            validity={displayNameValidity}
            error={errors[DISPLAY_NAME]}
          />
          <LandingInput
            type='password'
            placeholder='Password'
            value={password}
            inputType={PASSWORD}
            onBlur={this.onBlur}
            onTextChange={this.onTextChange}
            validity={passwordValidity}
            error={errors[PASSWORD]}
          />
          <LandingInput
            type='password'
            placeholder='Repeat Password'
            value={passwordRepeat}
            inputType={PASSWORD_REPEAT}
            onBlur={this.onBlur}
            onTextChange={this.onTextChange}
            validity={passwordRepeatValidity}
            error={errors[PASSWORD_REPEAT]}
          />
          <LandingButton onClick={this.onRegisterClick}>Register</LandingButton>
          <LandingModalLinks>
            <Link href='login'>
              <a>Already have an account? Log in</a>
            </Link>
          </LandingModalLinks>
          {this.renderGeneralErrors}
        </LandingModal>
      </LandingLayout>
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

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, REGISTER)
  ),
  dispatchBlurInput: (inputType, value, errors) => dispatch(
    blurInput(inputType, value, errors, REGISTER)
  ),
  dispatchSubmitForm: (inputFields) => dispatch(
    submitForm(inputFields, REGISTER)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
