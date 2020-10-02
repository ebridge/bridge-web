import styled from 'styled-components';
import ErrorContainer from './ModalErrorContainer';

const ModalInput = ({
  inputType,
  type,
  placeholder,
  value,
  validity,
  onTextChange,
  onBlur,
  error,
  isLoading,
}) => {
  let formError = null;
  // if error = true then previous errors were corrected
  if (error && error !== true) {
    formError = (
      <ErrorContainer>
        {error}
      </ErrorContainer>
    );
  }
  return (
    <>
      <StyledInput
        value={value}
        isValid={validity === true || typeof validity === 'undefined'}
        onChange={(event) => onTextChange(inputType, event.target.value)}
        onPaste={(event) => onTextChange(inputType, event.target.value)}
        onBlur={(event) => onBlur(inputType, event.target.value)}
        type={type}
        placeholder={placeholder}
        error={error}
        readOnly={isLoading}
      />
      {formError}
    </>
  );
};

const StyledInput = styled.input`
  position: relative;
  color: #384047;
  background-color: ${props => props.theme.colors.inputGrey};
  box-shadow: 0px 1px 1px rgba(0,0,0,0.03) inset;
  border-radius: 4px;

  width: 100%;
  padding: 1em;
  margin-top: 1em;

  ${(props) => (props.isValid && typeof props.error !== 'string' ? `
    border: 1px solid black;
  ` : `
    border: 1px solid red;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `)}
`;

export default ModalInput;
