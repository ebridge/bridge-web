import React from 'react';
import Router from 'next/router';
// import Link from 'next/link';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { updateText, submitForm, blurInput } from '../../redux/actions/formActions';
import LandingLayout from '../../components/landing/layout';
import LandingModal from '../../components/landing/modal';
// import LandingModalLinks from '../../components/landing/modalLinks';
// import LandingInput from '../../components/landing/input';
// import LandingButton from '../../components/landing/button';
import ErrorContainer from '../../components/landing/errorContainer';
import {
  // EMAIL,
  FORM_PENDING,
  FORM_SUBMITTED,
} from '../../constants/formConstants';
import { FORGOT } from '../../constants/reducersConstants';

class Forgot extends React.Component {
  constructor(props) {
    super(props);

    this.renderGeneralErrors = this.renderGeneralErrors.bind(this);
    this.onForgotClick = this.onForgotClick.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    return Router.push('/');
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


  onForgotClick() {
    const { dispatchSubmitForm, email } = this.props;
    dispatchSubmitForm({ email });
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
      // errors,
      email,
      // emailValidity,
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
            <span>
              If {email} matches an account in our database you will
              receive an email with a link to reset your password.
            </span>
          </LandingModal>
        </LandingLayout>
      );
    }
    return (
      <>
        <p>Redirecting...</p>
      </>
      // <LandingLayout>
      //   <LandingModal title='Reset Password'>
      //     <LandingInput
      //       type='email'
      //       placeholder='Enter your email'
      //       value={email}
      //       inputType={EMAIL}
      //       onBlur={this.onBlur}
      //       onTextChange={this.onTextChange}
      //       validity={emailValidity}
      //       error={errors[EMAIL]}
      //     />
      //     <LandingButton onClick={this.onForgotClick}>Send me a Link</LandingButton>
      //     <LandingModalLinks>
      //       <Link href='login'>
      //         <a>Remembered your account? Log in</a>
      //       </Link>
      //       <Link href='register'>
      //         <a>Create new account</a>
      //       </Link>
      //     </LandingModalLinks>
      //     {this.renderGeneralErrors}
      //   </LandingModal>
      // </LandingLayout>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Forgot);
