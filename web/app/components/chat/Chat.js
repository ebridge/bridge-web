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
// import { submitForm } from '../redux/actions/formActions';
// import { TEXTAREA } from '../constants/formConstants';

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      chatValue: '',
      collapsed: false,
      newMessage: false,
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

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behaivor: 'smooth' });
  }

  render() {
    const {
      chatValue,
      collapsed,
    } = this.state;
    const {
      width,
      socket,
      inRoom,
      globalChatMessages,
      roomChatMessages,
      chatPosition,
      setChatPosition,
    } = this.props;


    if (!socket) {
      // TODO: add failed to connect
      return null;
    }

    return (
      <ChatWrapper width={width}>
        <ChatBanner chatPosition={chatPosition}>
          <button title='Move chat' onClick={setChatPosition}>
            {chatPosition === 'right'
              ? <FirstPage />
              : <LastPage />
            }
          </button>
          <button title='Collapse Chat' onClick={this.collapseChat}>
            {collapsed
              ? <KeyboardArrowUp />
              : <KeyboardArrowDown />
            }
          </button>
        </ChatBanner>
        <ChatContainer
          chatMessages={inRoom ? roomChatMessages : globalChatMessages}
          collapsed={collapsed}
        >
          {globalChatMessages.map((entry, i) => (
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
  width: ${props => props.width};
  background: ${props => props.theme.colors.lightBlue};

  ${breakpoints.mobile} {
    width: 100vw;
  }
`;

const ChatBanner = styled.div`
  display: flex;
  flex-direction: ${({ chatPosition }) => (chatPosition === 'right' ? 'row' : 'row-reverse')};
  position: absolute;
  top: 0;

  width: 100%;
  height: 30px;
  background: #fff;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: baseline;
  background: ${props => props.theme.colors.lightBlue};
  max-height: 80vh;
  width: 98%;
  overflow-y: scroll;
  transition: all 0.3s ease-out;

  ${breakpoints.mobile} {
    max-height: ${({ collapsed }) => (collapsed ? '30px' : '25vh')};
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
