import styled from 'styled-components';

const ChatInput = ({
  value,
  height,
  onTextChange,
  placeholder,
  onSubmit,
  onKeyPress,
}) => (
  <ChatInputWrapper height={height}>
    <ChatTextarea
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
  width: 100%;
  height: ${({ height }) => `${height}px`};
`;

const ChatTextarea = styled.textarea`
  color: #384047;
  background-color: #e8eeef;
  height: 100%;
  width: 100%;
  resize: none;
`;

const ChatInputLimit = styled.span`
  position: absolute;
  right: 7px;
  bottom: 7px;

  font-size: 0.85em;
  color: rgba(0, 0, 0, 0.5);
`;

export default ChatInput;
