import { connect } from 'react-redux';
import styled from 'styled-components';
import FlexWrapper from '../components/common/FlexWrapper';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Form from '../components/modals/common/ModalForm';
import Input from '../components/modals/common/ModalInput';
import Button from '../components/modals/common/ModalButton';
import { blurInput, submitForm, updateText } from '../redux/actions/formActions';
import { RESET_PASSWORD } from '../constants/reducersConstants';
import { PASSWORD, PASSWORD_REPEAT } from '../constants/formConstants';
import { breakpoints } from '../lib/styleUtils';

const ResetPassword = ({
  emailToken,
  apiError,
  apiPending,
  formErrors,
  resetPassword,
  resetPasswordReapeat,
  resetPasswordValidity,
  resetPasswordRepeatValidity,
  dispatchUpdateText,
  dispatchBlurInput,
  dispatchSubmitForm,
}) => {
  const onTextChange = (inputType, value) => {
    dispatchUpdateText(inputType, value);
  };

  const onBlur = (inputType, value) => {
    dispatchBlurInput(inputType, value, formErrors);
  };

  const onSubmit = evt => {
    evt.preventDefault();
    if (apiPending) return;
    dispatchSubmitForm({ resetPassword, resetPasswordReapeat }, emailToken);
  };

  const isLoading = apiPending && !apiError;
  return (
    <FlexWrapper>
      <Navbar />
      <PageContent>
        <ContentWrapper>
          <h1>Reset Password</h1>
          <FormWrapper>
            <FormContainer>
              <Form>
                <Input
                  type='password'
                  placeholder='Password'
                  value={resetPassword}
                  inputType={PASSWORD}
                  onBlur={onBlur}
                  onTextChange={onTextChange}
                  validity={resetPasswordValidity}
                  error={formErrors[PASSWORD]}
                  isLoading={isLoading}
                />
                <Input
                  type='password'
                  placeholder='Repeat Password'
                  value={resetPasswordReapeat}
                  inputType={PASSWORD_REPEAT}
                  onBlur={onBlur}
                  onTextChange={onTextChange}
                  validity={resetPasswordRepeatValidity}
                  error={formErrors[PASSWORD_REPEAT]}
                  isLoading={isLoading}
                />
              </Form>
              <Button isLoading={isLoading} onClick={onSubmit}>Reset</Button>
            </FormContainer>
          </FormWrapper>
        </ContentWrapper>
      </PageContent>
      <Footer/>
    </FlexWrapper>
  );
};

ResetPassword.getInitialProps = ({ query }) => ({ emailToken: query.token });

const PageContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.1);
  padding: 2em;
  width: 80vw;

  ${breakpoints.mobile} {
    width: 100vw;
    padding: 0.5em;
    padding-bottom: 2em;
  }
`;

const FormWrapper = styled.div`
  font-size: 1em;
  background: #fff;
  padding: 8px;
  padding-top: 16px;
  border-radius: 2px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;
  ${breakpoints.mobile} {
    width: 100%;
  }
`;

const mapStateToProps = (state = {}) => ({
  apiError: state?.api?.userResetPasswordState?.error,
  apiPending: state?.api?.userResetPasswordState?.pending,
  formErrors: state?.resetPassword?.formErrors,
  resetPassword: state?.resetPassword?.password,
  resetPasswordReapeat: state?.resetPassword?.passwordReapeat,
  resetPasswordValidity: state?.resetPassword?.passwordValidity,
  resetPasswordRepeatValidity: state?.resetPassword?.passwordRepeatValidity,
});

const mapDispatchToProps = dispatch => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, RESET_PASSWORD)
  ),
  dispatchBlurInput: (inputType, value, errors) => dispatch(
    blurInput(inputType, value, errors, RESET_PASSWORD)
  ),
  dispatchSubmitForm: (inputFields, token) => dispatch(
    submitForm(inputFields, RESET_PASSWORD, token)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
