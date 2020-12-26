import styled from 'styled-components';
import MailOutlineSharp from '@material-ui/icons/MailOutlineSharp';
import { FORGOT_PASSWORD, REGISTER } from '../../constants/reducersConstants';

const EmailSentModal = ({ from }) => {
  let header;
  let subtext;

  switch (from) {
  case FORGOT_PASSWORD:
    header = 'Check your Email';
    subtext = (
      <>
        If the email you entered matches an account eBridge account, an email will be sent to that address.
        <br />
        <br />
        Please click the link in the email to reset your password.
      </>
    );
    break;
  case REGISTER:
  default:
    header = 'Confirm your Email';
    subtext = (
      <>
        Thanks for signing up!
        <br />
        <br />
        An email has been sent to the email you used to sign up.
        Please click on the link in that email to verify your account.
      </>
    );
  }
  return (
    <>
      <MailIconContainer>
        <MailOutlineSharp style={{ width: '50%', height: '50%' }}/>
        {header}
      </MailIconContainer>
      <SubText>
        {subtext}
      </SubText>
    </>
  );
};

const MailIconContainer = styled.div`
  width: 100%;
  height: 33%;
  margin-top: 1em;
  display: flex;
  flex-flow: column;
  align-items: center;

  color: ${props => props.theme.colors.logoDarkRed};
  font-size: 2em;
  text-align: center;
`;

const SubText = styled.span`
  text-align: center;
  font-size: 1.2em;
  color: #000;
`;

export default EmailSentModal;
