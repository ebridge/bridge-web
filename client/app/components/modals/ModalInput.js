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
}) => (
    <InputWrapper>
      <StyledInput
        value={value}
        isValid={validity === true || typeof validity === 'undefined'}
        onChange={(event) => onTextChange(inputType, event.target.value)}
        onBlur={(event) => onBlur(inputType, event.target.value)}
        type={type}
        placeholder={placeholder}
        error={error}
      />
      <ErrorContainer>
        {error && (<span>{error}</span>)}
      </ErrorContainer>
    </InputWrapper>
  );

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  position: relative;
  color: #384047;
  background-color: #e8eeef;
  box-shadow: 0px 1px 1px rgba(0,0,0,0.03) inset;
  border-radius: 4px;

  padding: 1em;
  margin-top: 1em;

  width: 100%;

  ${(props) => (props.isValid && typeof props.error !== 'string' ? `
    border: 1px solid black;
  ` : `
    border: 1px solid red;
  `)}
`;

export default ModalInput;
