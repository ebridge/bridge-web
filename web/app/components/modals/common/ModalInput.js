import { useState } from 'react';
import styled from 'styled-components';
import VisibilityOutlined from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlined from '@material-ui/icons/VisibilityOffOutlined';
import ErrorContainer from './ModalErrorContainer';
import PasswordRules from '../../common/PasswordRules';

const ModalInput = ({
  inputType,
  type,
  hideTogglePassword,
  placeholder,
  value,
  validity,
  onTextChange,
  onBlur,
  error,
  isLoading,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = evt => {
    evt.preventDefault();
    setIsPasswordVisible(!isPasswordVisible);
  };

  let switchPasswordType = type;
  if (type === 'password' || type === 'passwordRepeat') {
    if (isPasswordVisible) {
      switchPasswordType = 'text';
    }
  }

  const title = isPasswordVisible ? 'Hide Password' : 'Show Password';

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
      <InputWrapper>
        <StyledInput
          value={value}
          isValid={validity === true || typeof validity === 'undefined'}
          onChange={(event) => onTextChange(inputType, event.target.value)}
          onPaste={(event) => onTextChange(inputType, event.target.value)}
          onBlur={(event) => onBlur(inputType, event.target.value)}
          type={switchPasswordType}
          placeholder={placeholder}
          error={error}
          readOnly={isLoading}
        />
        {!hideTogglePassword && type === 'password'
          ? <ToggleVisibilityButton tabIndex='-1' type='button' title={title} onClick={togglePasswordVisibility}>
            {!isPasswordVisible ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
          </ToggleVisibilityButton>
          : null
        }
      </InputWrapper>
      {!formError && inputType === 'passwordRepeat' && <PasswordRules/>}
      {formError}
    </>
  );
};

const InputWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

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

const ToggleVisibilityButton = styled.button`
  position: absolute;
  right: 10px;
  top: 25px;
  border: none;
  outline: none;

  cursor: pointer;
  opacity: 0.5;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.8;
  }
`;

export default ModalInput;
