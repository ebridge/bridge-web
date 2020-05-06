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
  <StyledTextarea
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={(event) => onTextChange(inputType, event.target.value)}
    onSubmit={(event) => onSubmit(inputType, event.target.value)}
  />
);

const StyledTextarea = styled.textarea`
  color: #384047;
  background-color: #e8eeef;
  height: 5vh;
  width: 98%;
  resize: none;
`;

export default ChatInput;
