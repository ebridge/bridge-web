import {
  useState,
  useEffect,
  useRef,
} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import Checkbox from '../modals/common/ModalCheckbox';
import { WS_GLOBAL_MESSAGE, WS_ROOM_MESSAGE } from '../../constants/socketEvents';
import { breakpoints } from '../../lib/styleUtils';
import { validateAndTrimChat } from '../../lib/validationUtils';
import useLocalStorage from '../../lib/hooks/useLocalStorage';

const Chat = ({
  width,
  socket,
  inRoom,
  displayName,
  globalChatMessages,
  roomChatMessages,
}) => {
  const [chatValue, setChatValue] = useState('');
  const [canScroll, setCanScroll] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [showTimestamps, setShowTimestamps] = useLocalStorage('showTimestamps', false);
  const [profanityFilter, setProfanityFilter] = useLocalStorage('profanityFilter', false);
  const chatRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const optionsMenuRef = useRef(null);
  const optionsMenuToggleRef = useRef(null);
  const globalOrRoom = inRoom ? WS_ROOM_MESSAGE : WS_GLOBAL_MESSAGE;
  const chatMessages = inRoom ? roomChatMessages : globalChatMessages;
  const inputHeight = 70;
  const chatOptions = {
    showTimestamps,
    profanityFilter,
  };

  const handleOutsideChatOptionsClick = evt => {
    if (evt.target === optionsMenuToggleRef.current) {
      return;
    }
    if (optionsMenuRef.current && !optionsMenuRef.current.contains(evt.target)) {
      setIsOptionsMenuOpen(false);
    }
  };

  const showConnectedMessage = () => {
    // TODO: get room # and pass it here & get this to work
    const globalOrRoomNumber = inRoom ? 'Room x' : 'Global';
    const connectedMessage = {
      message: `Connected to ${globalOrRoomNumber} Chat... Say hi, ${displayName}!`,
    };
    chatMessages.push(connectedMessage);
  };

  const scrollToChatEnd = () => endOfMessagesRef.current.scrollIntoView({
    block: 'nearest',
    inline: 'end',
  });

  useEffect(() => {
    if (chatRef.current.scrollHeight > chatRef.current.clientHeight) {
      setCanScroll(true);
    }
    document.addEventListener('mousedown', handleOutsideChatOptionsClick);
    setTimeout(() => {
      scrollToChatEnd();
      showConnectedMessage();
    }, 250);
    return () => {
      document.removeEventListener('mousedown', handleOutsideChatOptionsClick);
    };
  }, []);

  const submitChat = () => {
    if (chatValue.trim() === '') return;
    const chatMessage = {
      user: displayName,
      message: validateAndTrimChat(chatValue),
      timestamp: Date.now(),
    };
    socket.emit(globalOrRoom, chatMessage);
    setChatValue(''); // Reset input value
    setTimeout(() => { scrollToChatEnd(); }, 250);
  };

  const handleTextChange = evt => {
    const { value } = evt.target;
    if (value.length < 151) {
      return setChatValue(value);
    }
    return null;
  };

  const handleKeyPress = evt => {
    if (evt.key === 'Enter' && !evt.shiftKey) {
      evt.preventDefault();
      return submitChat();
    }
    return null;
  };

  const handleScroll = evt => {
    if (chatRef.current.scrollHeight > chatRef.current.clientHeight) {
      setCanScroll(true);
    }
    const { target } = evt;
    if (target.scrollTop >= (target.scrollHeight - target.offsetHeight - 8)) {
      return setIsScrolledToBottom(true);
    }
    return setIsScrolledToBottom(false);
  };

  const toggleOptionsMenu = () => {
    setIsOptionsMenuOpen(!isOptionsMenuOpen);
  };


  const toggleProfanityFilter = (x, checked) => {
    setProfanityFilter(checked);
  };

  const toggleTimestamps = (x, checked) => {
    setShowTimestamps(checked);
  };

  return (
    <ChatWrapper width={width} onScroll={handleScroll}>
      <ChatMessagesContainer ref={chatRef} hideScrollbar={isScrolledToBottom}>
        <ChatMessages
          messages={chatMessages}
          options={chatOptions}
        />
        <ChatMessagesEnd ref={endOfMessagesRef} />
      </ChatMessagesContainer>
      <ChatInput
        value={chatValue}
        height={inputHeight}
        handleTextChange={handleTextChange}
        placeholder='Type a message... (press enter to send)'
        onSubmit={submitChat}
        handleKeyPress={handleKeyPress}
        isScrolledToBottom={isScrolledToBottom}
      />
      {canScroll
        ? <JumpToBottom
          type='button'
          pxBottom={inputHeight}
          onClick={scrollToChatEnd}
          hide={isScrolledToBottom}
        >
          Jump to Bottom
        </JumpToBottom>
        : null}
      <ChatButtonsBar>
        <OptionsMenu isOpen={isOptionsMenuOpen} ref={optionsMenuRef}>
          <OptionsMenuTitle>Chat Options
            <OptionsMenuClose onClick={toggleOptionsMenu}><CloseIcon /></OptionsMenuClose>
          </OptionsMenuTitle>
          <ChatOption>
            <Checkbox
              type='checkbox'
              checked={showTimestamps}
              label='Show Timestamps'
              onChange={toggleTimestamps}
            />
          </ChatOption>
          <ChatOption>
            <Checkbox
              type='checkbox'
              checked={profanityFilter}
              label='Profanity Filter'
              onChange={toggleProfanityFilter}
            />
          </ChatOption>
        </OptionsMenu>
        <OptionsMenuToggleRef
          ref={optionsMenuToggleRef}
          title='Chat Options'
          onClick={toggleOptionsMenu}
        >
          <SettingsIcon style={{ pointerEvents: 'none' }}/>
        </OptionsMenuToggleRef>
        <SendChat title='Send Chat' onClick={submitChat}><span>Send&nbsp;</span><SendIcon /></SendChat>
      </ChatButtonsBar>
    </ChatWrapper>
  );
};

const ChatWrapper = styled.div`
  width: ${props => props.width};
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  overflow: hidden;

  padding: 0 6px;

  ${breakpoints.mobile} {
    height: 46vh;
    width: 100vw;
  }
`;

const ChatMessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: baseline;
  flex-grow: 4;
  width: 100%;
  height: 80%;
  padding: 6px;
  overflow-y: scroll;
  transition: all 0.3s ease-out;

  /* Scrollbar */
  &::-webkit-scrollbar {
    cursor: pointer;
    display: ${({ hideScrollbar }) => (hideScrollbar ? 'none' : 'block')};
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: none;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 6px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
`;

const ChatMessagesEnd = styled.div`
  float: left;
  clear: both;
`;

const JumpToBottom = styled.button`
  display: ${({ hide }) => (hide ? 'none' : 'inline')};
  bottom: ${({ pxBottom }) => `${pxBottom + 30}px`};
  position: absolute;
  cursor: pointer;
  height: 24px;
  width: calc(100% - 12px);

  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  outline: none;

  border: none;
  border-radius: 4px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
  &:active {
    background: rgba(0, 0, 0, 0.45);
  }

  ${breakpoints.mobile} {
    bottom: ${({ pxBottom }) => `${pxBottom + 26}px`}
  }
`;

const ChatButtonsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  width: 100%;
  height: 30px;
`;

const OptionsMenu = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: left;

  position: absolute;
  background: #fff;
  border: 1px solid #000;
  border-radius: 6px;
  bottom: 30px;
`;

const OptionsMenuTitle = styled.div`
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.quicksand};
  font-size: 1em;
  padding: 8px 0;
  padding-left: 10px;
  border-bottom: 1px solid grey;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0.4em 4px;
  font-family: ${({ theme }) => theme.fonts.quicksand};
`;

const ChatOptionsButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;

  color: rgba(0, 0, 0, 0.5);

  &:hover {
    color: rgba(0, 0, 0, 0.4);
  }

  &:active {
    color: rgba(0, 0, 0, 0.45)
  }
`;

const OptionsMenuToggleRef = styled(ChatOptionsButton)``;

const OptionsMenuClose = styled(ChatOptionsButton)``;

const SendChat = styled(ChatOptionsButton)`
  font-family: ${({ theme }) => theme.fonts.quicksand};
  font-size: 0.9em;
  padding: 0 1em;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  
  span {
    color: #000;
  }
`;

const mapStateToProps = (state = {}) => ({
  globalChatMessages: state?.chat?.globalChatMessages,
  roomChatMessages: state?.chat?.roomChatMessages,
});

export default connect(mapStateToProps)(Chat);
