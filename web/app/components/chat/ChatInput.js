import styled from 'styled-components';

const ChatInput = ({
  type,
  placeholder,
  value,
  onTextChange,
  onSubmit,
  onKeyPress,
  collapsed,
  scrollToBottom,
  isScrolledToBottom,
}) => (
  <ChatInputWrapper collapsed={collapsed}>
    {isScrolledToBottom
      ? null
      : <ScrollToBottomWrapper collapsed={collapsed} onClick={scrollToBottom}>
        <ScrollToBottomButton >
              Jump to Bottom
        </ScrollToBottomButton>
      </ScrollToBottomWrapper>
    }
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
  right: 7px;
  bottom: 7px;

  font-size: 0.85em;
  color: rgba(0, 0, 0, 0.5);
`;

const ScrollToBottomWrapper = styled.div`
  position: absolute;
  width: 116px;
  top: -20px;
  right: 20px;
  margin: auto;
  transform: translate(0, -50%);
  margin: auto;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 4px;
  display: ${({ collapsed }) => (collapsed ? 'none' : 'block')};

  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.4);
  }
  &:active {
    background: rgba(0, 0, 0, 0.6);
  }
`;

const ScrollToBottomButton = styled.button`
  cursor: pointer;
  color: #fff;
  background: none;
  outline: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


export default ChatInput;
