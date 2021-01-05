import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import { WS_GLOBAL_MESSAGE, WS_ROOM_MESSAGE } from '../../constants/socketEvents';
import { breakpoints } from '../../lib/styleUtils';
import { validateAndTrimChat } from '../../lib/validationUtils';
import ChatInput from './ChatInput';

const Chat = ({
  width,
  socket,
  inRoom,
  displayName,
  globalChatMessages,
  roomChatMessages,
}) => {
  const [chatValue, setChatValue] = useState('');
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const endOfMessages = useRef(null);
  const optionsMenuRef = useRef(null);
  const optionsMenuToggleRef = useRef(null);
  const globalOrRoom = inRoom ? WS_ROOM_MESSAGE : WS_GLOBAL_MESSAGE;

  const handleOutsideChatOptionsClick = evt => {
    console.log('target: ', evt.target.parentNode?.parentNode);
    console.log(optionsMenuToggleRef.current.parentNode);
    if (evt.target === optionsMenuToggleRef.current) {
      return;
    }
    if (optionsMenuRef.current && !optionsMenuRef.current.contains(evt.target)) {
      setIsOptionsMenuOpen(false);
    }
  };

  const scrollToChatEnd = () => endOfMessages.current.scrollIntoView({
    block: 'nearest',
    inline: 'end',
  });

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideChatOptionsClick);
    // TODO: better solution than setTimeout to make this work?
    setTimeout(() => { scrollToChatEnd(); }, 250);
    return () => {
      document.removeEventListener('mousedown', handleOutsideChatOptionsClick);
    };
  }, []);

  const handleTextChange = value => {
    if (value.length < 151) {
      return setChatValue(value);
    }
    return null;
  };

  const submitChat = () => {
    if (chatValue.trim() === '') return;
    const chatMessage = {
      user: displayName,
      message: validateAndTrimChat(chatValue),
      timestamp: Date.now(),
    };
    socket.emit(globalOrRoom, chatMessage);
    setChatValue(''); // Reset input value
  };

  const handleKeyPress = evt => {
    if (evt.key === 'Enter') {
      return submitChat();
    }
    return null;
  };

  const handleScroll = evt => {
    const { target } = evt;
    if (target.scrollTop >= (target.scrollHeight - target.offsetHeight - 8)) {
      return setIsScrolledToBottom(true);
    }
    return setIsScrolledToBottom(false);
  };

  const toggleOptionsMenu = () => {
    setIsOptionsMenuOpen(!isOptionsMenuOpen);
  };


  const generateChatMessages = () => {
    const chatMessages = inRoom ? roomChatMessages : globalChatMessages;
    if (!chatMessages) {
      return (
        <ChatMessage>Error connecting to chat... Please reload the page to reconnect.</ChatMessage>
      );
    }
    return chatMessages.map((entry, i) => (
      <ChatMessage key={i}>
        <ChatMessageUser>
          {entry.user}
        </ChatMessageUser>
        :&nbsp;{entry.message}
      </ChatMessage>
    ));
  };

  const inputHeight = 70;
  return (
    <ChatWrapper width={width} onScroll={handleScroll}>
      <ChatMessagesContainer hideScrollbar={isScrolledToBottom}>
        {generateChatMessages()}
        <ChatMessagesEnd ref={endOfMessages} />
      </ChatMessagesContainer>
      <ChatInput
        value={chatValue}
        height={inputHeight}
        onTextChange={handleTextChange}
        placeholder='Type a message... (press enter to send)'
        onSubmit={submitChat}
        onKeyPress={handleKeyPress}

        isScrolledToBottom={isScrolledToBottom}
      />
      <JumpToBottom
        type='button'
        pxBottom={inputHeight}
        onClick={scrollToChatEnd}
        hide={isScrolledToBottom}
      >Jump to Bottom
      </JumpToBottom>
      <ChatButtonsBar>
        <OptionsMenu isOpen={isOptionsMenuOpen} ref={optionsMenuRef}>
          <OptionsMenuTitle>Chat Options
            <OptionsMenuClose onClick={toggleOptionsMenu}><CloseIcon /></OptionsMenuClose>
          </OptionsMenuTitle>
          <ChatOption>
            <ChatOptionCheckbox type='checkbox' />
            <label>Show Timestamps</label>
          </ChatOption>
          <ChatOption>
            <ChatOptionCheckbox type='checkbox' />
            <label>Profanity Filter</label>
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

  max-height: 100%;
  overflow: hidden;

  padding: 0 6px;

  ${breakpoints.mobile} {
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

  ${breakpoints.mobile} {
    max-height: '25vh';
  }
`;

const ChatMessage = styled.div`
  width: 100%;
  padding: 0.3em;
  padding-right: 1em;
  color: #000;
  border-radius: 5px;

  &:hover {
    background: rgba(0,0,0,0.1);
  }
`;

const ChatMessageUser = styled.span`
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.quicksand};

  &:hover {
    text-decoration: underline;
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
  width: calc(30vw - 12px);

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
  padding: 10px 20px;
  border-bottom: 1px solid grey;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatOption = styled.div`
  padding: 6px 0.8em;
  font-family: ${({ theme }) => theme.fonts.quicksand};
`;

const ChatOptionCheckbox = styled.input`
  
`;

const ChatOptionsButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  position: relative;
  z-index: 10;

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
