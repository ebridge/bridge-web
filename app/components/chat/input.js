import React from 'react';
import styled from 'styled-components';

const ChatInput = ({
  type,
  placeholder,
  value,
  onTextChange,
  inputType,
  onSubmit,
}) => (
  <InputWrapper>
    <StyledTextarea
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onTextChange(inputType, event.target.value)}
      onSubmit={(event) => onSubmit(inputType, event.target.value)}
    />
  </InputWrapper>
);

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 10vh;
`;

const StyledTextarea = styled.textarea`
  position: relative;
  color: #384047;
  background-color: #e8eeef;
  height: 100%;
`;

export default ChatInput;
