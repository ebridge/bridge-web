import { memo } from 'react';
import styled from 'styled-components';
import Filter from 'bad-words';

const formatDate = date => new Date(date).toISOString().slice(11, -8);

const filterChat = message => {
  const filter = new Filter();
  if (!message) return message;
  return filter.clean(message);
};

const generateChat = (messages, options) => {
  if (!messages) {
    return (
      <ChatMessage>Error connecting to chat... Please reload the page to attempt to reconnect.</ChatMessage>
    );
  }
  return messages.map((entry, i) => (
    <ChatMessage key={i}>
      {entry.timestamp && options.showTimestamps
        ? <Timestamp title={ new Date(entry.timestamp).toISOString()}>
          {formatDate(entry.timestamp)}&nbsp;
        </Timestamp>
        : null
      }
      {entry.user && <>
        <ChatMessageUser>
          {entry.user}
        </ChatMessageUser>
        :&nbsp;</>
      }
      {entry.message && options.profanityFilter
        ? filterChat(entry.message)
        : entry.message
      }
    </ChatMessage>
  ));
};

const ChatMessages = memo(({ messages, options }) => generateChat(messages, options), (prev, next) => {
  if (prev.options.showTimestamps !== next.options.showTimestamps) {
    return false;
  }
  if (prev.options.profanityFilter !== next.options.profanityFilter) {
    return false;
  }
  if (prev.messages.length === next.messages.length) {
    return true;
  }
  return false;
});

const ChatMessage = styled.div`
  width: 100%;
  padding: 0.2em 0;
  padding-right: 1em;
  color: #000;
  border-radius: 5px;

  /* &:hover {
    background: rgba(0,0,0,0.1);
  } */
`;

const ChatMessageUser = styled.span`
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.quicksand};

  &:hover {
    text-decoration: underline;
  }
`;

const Timestamp = styled.time`
  color: grey;
  font-size: 0.8em;
  padding: 0.3em 0;
  padding-right: 0.4em;
`;

export default ChatMessages;
