import styled from 'styled-components';
import MailOutlineSharp from '@material-ui/icons/MailOutlineSharp';

const EmailSentModal = () => (
  <>
    <MailIconContainer>
      <MailOutlineSharp style={{ width: '50%', height: '50%' }}/>
      Confirm Your Email
    </MailIconContainer>
    <SubText>
      Thanks for signing up!
      <br />
      <br />
      An email has been sent to the email you used to sign up.
      Please click on the link in that email to verify your account.
    </SubText>
  </>
);

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
