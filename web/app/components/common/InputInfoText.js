import styled from 'styled-components';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const InputInfoText = ({ text }) => (
  <InfoTextContainer>
    <Icon><InfoOutlinedIcon fontSize='small' /></Icon>
    <Text>{text}</Text>
  </InfoTextContainer>
);


const InfoTextContainer = styled.div`
  display: flex;
  align-items: top;
  /* justify-content: left; */
  padding: 2px 2px;
  font-size: 0.9em;
  color: #384047;
`;

const Icon = styled.span`
  padding-right: 4px;
  /* color: #45d7ff; */
  opacity: 0.8;
`;

const Text = styled.span`
  padding-top: 2px;
`;

export default InputInfoText;
