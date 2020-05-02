import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../lib/styleUtils';
import ChatInput from './chat/input';
import { submitForm } from '../redux/actions/formActions';
import { TEXTAREA } from '../constants/formConstants';

class Chat extends React.Component {
  constructor() {
    super();

    this.state = {

    };
  }

  render() {
    return (
      <ChatWrapper>
        <ChatInput
          type='textarea'
          placeholder='Type a message...'
        />
      </ChatWrapper>
    );
  }
}

const ChatWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  width: 20vw;
  background: green;

  ${breakpoints.mobile} {
    width: 100vw;
  }
`;

export default Chat;
