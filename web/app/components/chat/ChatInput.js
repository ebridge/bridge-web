import styled from 'styled-components';

const ChatInput = ({
  type,
  placeholder,
  value,
  onTextChange,
  onSubmit,
  onKeyPress,
  collapsed,
}) => (
  <ChatInputWrapper collapsed={collapsed}>
    <ChatTextArea
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onTextChange(event.target.value)}
      onSubmit={() => onSubmit()}
      onKeyPress={(event) => onKeyPress(event)}
    />
    {value && <ChatInputLimit>{value.length} / 150 </ChatInputLimit>}
  </ChatInputWrapper>
);

const ChatInputWrapper = styled.div`
  position: relative;
  display: ${({ collapsed }) => (collapsed ? 'none' : 'block')};
  width: 98%;
  bottom: 0;
`;

const ChatTextArea = styled.textarea`
  color: #384047;
  background-color: #e8eeef;
  height: 6vh;
  width: 100%;
  resize: none;
`;

const ChatInputLimit = styled.span`
    position: absolute;
    right: 6px;
    bottom: 6px;

    font-size: 0.85em;
    color: rgba(0, 0, 0, 0.5);
`;

export default ChatInput;
