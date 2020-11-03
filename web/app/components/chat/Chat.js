import React from 'react';
import styled from 'styled-components';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import { breakpoints } from '../../lib/styleUtils';
import ChatInput from './ChatInput';
// import { submitForm } from '../redux/actions/formActions';
// import { TEXTAREA } from '../constants/formConstants';

class Chat extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    const {
      width,
      chatPosition,
      setChatPosition,
    } = this.props;
    return (
      <ChatWrapper width={width}>
        <ChatBanner chatPosition={chatPosition}>
          <button title='Move chat' onClick={setChatPosition}>
            {chatPosition === 'right'
              ? <FirstPage />
              : <LastPage />
            }
          </button>
        </ChatBanner>
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
  background: ${props => props.theme.colors.lightBlue};
  height: 100%;
  width: 98%;
`;

export default Chat;
