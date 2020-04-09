/* eslint-disable react/prop-types */
import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { updateText, submitRegistrationForm } from '../redux/actions/form_actions';
// TODO: Fix landing layout
// import LandingLayout from '../components/landing/layout';
import LandingModal from '../components/landing/modal';
import LandingModalLinks from '../components/landing/modalLinks';
import LandingInput from '../components/landing/input';
import LandingButton from '../components/landing/button';
import {
  EMAIL,
  DISPLAY_NAME,
  PASSWORD,
  PASSWORD_REPEAT,
  FORM_PENDING,
  FORM_SUBMITTED,
} from '../constants/forms';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.renderErrors = this.renderGeneralErrors.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onRegisterClick = this.onRegisterClick.bind(this);
  }

  renderGeneralErrors() {
    const { errors = {} } = this.props;
    if (!errors.general || !errors.general.length) {
      return null;
    }
    return (
      <ErrorContainer>
        {errors.general.map((error) => (
          <p key={error}>{error}</p>
        ))}
      </ErrorContainer>
    );
  }

  onRegisterClick() {
    const { dispatchSubmitRegistrationForm } = this.props;
    dispatchSubmitRegistrationForm();
  }

  onTextChange(formType, value) {
    const { dispatchUpdateText } = this.props;
    dispatchUpdateText(formType, value);
  }

  render() {
    const {
      registrationFormStatus,
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

    if (registrationFormStatus === FORM_PENDING) {
      return (
        <LandingModal title='Sign up'>
          TODO: Loading / pending
        </LandingModal>
      );
    }

    if (registrationFormStatus === FORM_SUBMITTED) {
      return (
        <LandingModal title='Sign up'>
          TODO: Submitted please confirm your email address.
        </LandingModal>
      );
    }

    return (
      <LandingModal title='Sign up'>
        <LandingInput name={EMAIL} type='email' placeholder='Email' onTextChange={this.onTextChange} value={email} validity={emailValidity} errors={errors[EMAIL]} />
        <LandingInput name={DISPLAY_NAME} type='text' placeholder='Display Name' onTextChange={this.onTextChange} value={displayName} validity={displayNameValidity} errors={errors[DISPLAY_NAME]} />
        <LandingInput name={PASSWORD} type='password' placeholder='Password' onTextChange={this.onTextChange} value={password} validity={passwordValidity} errors={errors[PASSWORD]} />
        <LandingInput name={PASSWORD_REPEAT} type='password' placeholder='Repeat Password' onTextChange={this.onTextChange} value={passwordRepeat} validity={passwordRepeatValidity} errors={errors[PASSWORD_REPEAT]} />
        <LandingButton onClick={this.onRegisterClick}>Register</LandingButton>
        <LandingModalLinks>
          <Link href='login'>
            <a>Already have an account? Log in</a>
          </Link>
        </LandingModalLinks>
        {this.renderGeneralErrors}
      </LandingModal>
    );
  }
}

// TODO: Style and maybe move?
const ErrorContainer = styled.div`
  width: 100%;
  color: red;
`;

const mapStateToProps = (state = fromJS({})) => {
  const registerPage = state.get('registerPage');
  return {
    registrationFormStatus: registerPage.get('registrationFormStatus'),
    errors: registerPage.get('errors'),
    email: registerPage.get('email'),
    displayName: registerPage.get('displayName'),
    password: registerPage.get('password'),
    passwordRepeat: registerPage.get('passwordRepeat'),
    emailValidity: registerPage.get('emailValidity'),
    displayNameValidity: registerPage.get('displayNameValidity'),
    passwordValidity: registerPage.get('passwordValidity'),
    passwordRepeatValidity: registerPage.get('passwordRepeatValidity'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateText: (formType, value) => dispatch(updateText(formType, value)),
  dispatchSubmitRegistrationForm: () => dispatch(submitRegistrationForm()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
