import styled from 'styled-components';
import MailOutlineSharp from '@material-ui/icons/MailOutlineSharp';

const EmailSentModal = () => (
  <>
    <MailIconContainer>
      Confirm Your Email
      <MailOutlineSharp style={{ width: '60%', height: '60%' }}/>
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
  height: 50%;
  display: flex;
  flex-flow: column;
  align-items: center;

  color: ${props => props.theme.colors.logoDarkRed};
  font-size: 2em;
  text-align: center;
`;

const SubText = styled.span`
  text-align: center;
  font-size: 1.5em;
  color: #000;
`;

export default EmailSentModal;
