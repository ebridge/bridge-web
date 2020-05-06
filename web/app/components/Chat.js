import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../lib/styleUtils';
import ChatInput from './chat/ChatInput';
// import { submitForm } from '../redux/actions/formActions';
// import { TEXTAREA } from '../constants/formConstants';

class Chat extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    return (
      <ChatWrapper width={this.props.width}>
        <ChatContainer />
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
  flex-direction: column;
  align-items: center;
  width: ${props => props.width};
  background: ${props => props.theme.colors.green};

  ${breakpoints.mobile} {
    width: 100vw;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.lightBlue};
  height: 100%;
  width: 98%;
`;

export default Chat;
