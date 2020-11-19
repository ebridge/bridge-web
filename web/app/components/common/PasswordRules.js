import styled from 'styled-components';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const PasswordRules = () => (
  <PasswordRulesContainer>
    <InfoOutlinedIcon />&nbsp;Use 8 or more characters with a mix of letters, numbers &amp; symbols.
  </PasswordRulesContainer>
);


const PasswordRulesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 2px 2px;

  color: #384047;
  font-size: 0.9em;
`;

export default PasswordRules;
