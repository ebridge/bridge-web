import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import LandingLayout from '../components/landing/layout';
import LandingModal from '../components/landing/modal';
import LandingModalLinks from '../components/landing/modalLinks';
import LandingInput from '../components/landing/input';
import LandingButton from '../components/landing/button';
import ErrorContainer from '../components/landing/errorContainer';
import { LOGIN } from '../constants/reducersConstants';
import {
  updateText,
  submitForm,
  blurInput,
  // mapDispatchToProps,
} from '../redux/actions/formActions';
import {
  EMAIL,
  PASSWORD,
  FORM_PENDING,
  FORM_SUBMITTED,
} from '../constants/formConstants';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.onLoginClick = this.onLoginClick.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  renderGeneralErrors() {
    const { errors = {} } = this.props;
    return (
      <ErrorContainer>
        <span>{errors.general}</span>
      </ErrorContainer>
    );
  }


  onLoginClick() {
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
      password,
      emailValidity,
      passwordValidity,
    } = this.props;


    if (formStatus === FORM_PENDING) {
      return (
        <LandingLayout>
          <LandingModal>
            TODO: Loading / pending
          </LandingModal>
        </LandingLayout>
      );
    }

    if (formStatus === FORM_SUBMITTED) {
      return (
        <LandingLayout>
          <LandingModal>
          TODO: Redirect to site
          </LandingModal>
        </LandingLayout>
      );
    }

    return (
      <LandingLayout>
        <LandingModal title='Log in'>
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
          <LandingButton onClick={this.onLoginClick}>Log In</LandingButton>
          <LandingModalLinks>
            <Link href='/register'>
              <a>Create an account</a>
            </Link>
            <Link href='/forgot'>
              <a>Forgot your password?</a>
            </Link>
          </LandingModalLinks>
        </LandingModal>
      </LandingLayout>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
