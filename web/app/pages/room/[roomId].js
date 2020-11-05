import styled from 'styled-components';
import { connect, useStore } from 'react-redux';
import Router from 'next/router';
import { leaveRoom } from '../../redux/actions/roomsActions';
import setSocketListeners, { getSocket } from '../../redux/socket/socket';
import { WS_JOIN_ROOM } from '../../constants/socketEvents';
import Navbar from '../../components/Navbar';
import Chat from '../../components/chat/Chat';
import Footer from '../../components/Footer';
import { breakpoints } from '../../lib/styleUtils';

let socket;

const Room = ({
  userId,
  displayName,
  dispatchLeaveRoom,
}) => {
  if (!userId) { // When user is not logged in
    Router.replace('/');
  }

  const store = useStore();
  if (typeof getSocket() === 'undefined') {
    socket = setSocketListeners(store);
    socket.connect();
    setTimeout(() => socket.emit(WS_JOIN_ROOM, true), 100);
  } else if (!socket) {
    socket = getSocket();
    socket.connect();
    setTimeout(() => socket.emit(WS_JOIN_ROOM, true), 100);
  }

  const chatPosition = 'right';

  return (
    <>
      <Navbar
        height='8vh'
        displayName={displayName}
      />
      <FlexWrapper height='87vh' chatPosition={chatPosition}>
        <div style={{ width: '80vw' }}></div>
        <Chat
          width='20vw'
          socket={socket}
          chatPosition={chatPosition}
          displayName={displayName}
          inRoom
        // setChatPosition={this.setChatPosition}
        />
      </FlexWrapper>
      <Footer height='5vh'>
        <span>&copy; Copyright Ethan Bonsignori 2020</span>
      </Footer>
    </>
  );
};

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: ${({ chatPosition }) => (chatPosition === 'right' ? 'row' : 'row-reverse')};
  justify-content: right;
  height: ${props => props.height};

  ${breakpoints.mobile} {
    flex-direction: column;
    height: 80vh;
  }
`;

const mapDispatchToProps = dispatch => ({
  dispatchLeaveRoom: roomId => dispatch(
    leaveRoom(roomId)
  ),
});

export default connect(null, mapDispatchToProps)(Room);
