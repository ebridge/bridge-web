import { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { breakpoints } from '../../lib/styleUtils';
import ChatInput from './ChatInput';
import { WS_GLOBAL_MESSAGE, WS_ROOM_MESSAGE } from '../../constants/socketEvents';
import { validateAndTrimChat } from '../../lib/validationUtils';

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      chatValue: '',
      collapsed: false,
      newMessage: false,
      isScrolledToBottom: true,
    };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  onTextChange = value => {
    if (value.length < 151) {
      this.setState({
        chatValue: value,
      });
    }
    return null;
  }

  onKeyPress = event => {
    const { chatValue } = this.state;
    if (event.key === 'Enter' && chatValue.trim() !== '') {
      event.preventDefault();
      this.submitChat();
    }
  }

  collapseChat = () => {
    this.setState(prevState => ({
      collapsed: !prevState.collapsed,
    }));
  }

  submitChat = () => {
    const { chatValue } = this.state;
    const { socket, inRoom, displayName } = this.props;
    let globalOrRoom = WS_GLOBAL_MESSAGE;
    if (inRoom) {
      globalOrRoom = WS_ROOM_MESSAGE;
    }

    const message = {
      user: displayName,
      message: validateAndTrimChat(chatValue),
      timestamp: Date.now(),
    };

    socket.emit(globalOrRoom, message);
    this.setState({
      chatValue: '',
    });

    setTimeout(this.scrollToBottom, 100);
  }

  handleScroll = event => {
    const { target } = event;

    if (target.scrollHeight - target.scrollTop !== target.clientHeight) {
      return this.setState({
        isScrolledToBottom: false,
      });
    }
    return this.setState({
      isScrolledToBottom: true,
    });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behaivor: 'smooth' });
  }

  render() {
    const {
      chatValue,
      collapsed,
      isScrolledToBottom,
    } = this.state;
    const {
      width,
      socket,
      inRoom,
      globalChatMessages,
      roomChatMessages,
      isChatRight,
      setIsChatRight,
    } = this.props;

    const chatMessages = inRoom ? roomChatMessages : globalChatMessages;
    if (!socket) {
      // TODO: add failed to connect
      return null;
    }

    return (
      <ChatWrapper width={width}>
        <ChatBanner isChatRight={isChatRight}>
          <MoveChatButton title='Move chat' onClick={() => setIsChatRight(!isChatRight)}>
            {isChatRight
              ? <FirstPage />
              : <LastPage />
            }
          </MoveChatButton>
          <CollapseButton title='Collapse Chat' onClick={this.collapseChat}>
            {collapsed
              ? <KeyboardArrowUp />
              : <KeyboardArrowDown />
            }
          </CollapseButton>
        </ChatBanner>
        <ChatContainer
          isScrolledToBottom={isScrolledToBottom}
          onScroll={this.handleScroll}
          collapsed={collapsed}
        >
          {chatMessages.map((entry, i) => (
            <ChatMessage key={i}>
              <span><b>{entry.user}:</b> {entry.message}</span>
            </ChatMessage>
          ))
          }
          <div style={{ float: 'left', clear: 'both' }}
            ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </ChatContainer>
        <ChatInput
          type='textarea'
          placeholder='Type a message... (press enter to send)'
          onTextChange={this.onTextChange}
          onKeyPress={this.onKeyPress}
          onSubmit={this.submitChat}
          value={chatValue}
          collapsed={collapsed}
          isScrolledToBottom={isScrolledToBottom}
          scrollToBottom={this.scrollToBottom}
        />
      </ChatWrapper>
    );
  }
}

const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: ${props => props.width};
  min-width: ${props => props.width};
  background: ${props => props.theme.colors.lightBlue};

  ${breakpoints.mobile} {
    width: 100vw;
  }
`;

const ChatBanner = styled.div`
  display: flex;
  flex-direction: ${({ isChatRight }) => (isChatRight ? 'row' : 'row-reverse')};

  width: 100%;
  height: 30px;
  background: #fff;
`;

const CollapseButton = styled.button`
    display: none;

  ${breakpoints.mobile} {
    display: block;
  }
`;

const MoveChatButton = styled.button`
  display: block;

  ${breakpoints.mobile} {
    display: none;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: baseline;
  flex-grow: 4;
  background: ${props => props.theme.colors.lightBlue};
  max-height: 80vh;
  width: 98%;
  overflow-y: auto;
  transition: all 0.3s ease-out;

  /* Scrollbar */
  &::-webkit-scrollbar {
    display: ${({ isScrolledToBottom }) => (isScrolledToBottom ? 'none' : 'block')};
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: none;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 6px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }

  ${breakpoints.mobile} {
    max-height: ${({ collapsed }) => (collapsed ? '0px' : '25vh')};
  }
`;

const ChatMessage = styled.div`
  width: 90%;
  margin: 0.3em;
  color: #000;
  border-radius: 5px;
`;

const mapStateToProps = (state = {}) => ({
  globalChatMessages: state?.chat?.globalChatMessages,
  roomChatMessages: state?.chat?.roomChatMessages,
});

export default connect(mapStateToProps)(Chat);
