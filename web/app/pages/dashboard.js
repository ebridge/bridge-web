import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect, useStore } from 'react-redux';
import Router from 'next/router';
import Navbar from '../components/Navbar';
import Rooms from '../components/rooms/Rooms';
import Footer from '../components/Footer';
import Chat from '../components/chat/Chat';
import { breakpoints } from '../lib/styleUtils';
import {
  getAllRooms,
  joinRoom,
  leaveRoom,
} from '../redux/actions/roomsActions';
import setSocketListeners, { getSocket } from '../redux/socket/socket';
import { WS_JOIN_GLOBAL } from '../constants/socketEvents';
import useLocalStorage from '../lib/hooks/useLocalStorage';

let socket;

const Dashboard = ({
  userId,
  displayName,
  dispatchGetAllRooms,
  dispatchJoinRoom,
  dispatchLeaveRoom,
  rooms,
}) => {
  if (!userId) { // When user is not logged in
    Router.replace('/');
  }

  // const [prevLocalStorageSetting, setPrevLocalStorageSetting] = useState(false);
  const [preventRender, setPreventRender] = useState(true);
  const [isChatRight, setIsChatRight] = useLocalStorage('isChatRight', true);

  const store = useStore();
  if (typeof getSocket() === 'undefined') {
    socket = setSocketListeners(store);
    socket.connect();
    setTimeout(() => socket.emit(WS_JOIN_GLOBAL, true), 100);
  } else if (!socket) {
    socket = getSocket();
    socket.connect();
    setTimeout(() => socket.emit(WS_JOIN_GLOBAL, true), 100);
  }

  useEffect(() => {
    dispatchGetAllRooms();
    setTimeout(setPreventRender(false), 200);
  }, []);

  if (preventRender) {
    return null;
  }
  return (
    <>
      <Navbar
        height='8vh'
        displayName={displayName}
      />
      <FlexWrapper height='87vh' isChatRight={isChatRight}>
        <Rooms
          width='70vw'
          rooms={rooms}
          dispatchJoinRoom={dispatchJoinRoom}
          dispatchLeaveRoom={dispatchLeaveRoom}
        />
        <Chat
          width='30vw'
          socket={socket}
          isChatRight={isChatRight}
          displayName={displayName}
          setIsChatRight={setIsChatRight}
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
  flex-direction: ${({ isChatRight }) => (isChatRight ? 'row' : 'row-reverse')};
  justify-content: right;
  height: ${props => props.height};

  ${breakpoints.mobile} {
    flex-direction: column;
    height: 90vh;
  }
`;

const mapStateToProps = (state = {}) => ({
  rooms: state?.rooms?.rooms,
});

const mapDispatchToProps = dispatch => ({
  dispatchGetAllRooms: () => dispatch(
    getAllRooms()
  ),
  // dispatchGetOneRoon: () => dispatch(
  //   getOneRoom()
  // ),
  dispatchJoinRoom: (roomId, seat) => dispatch(
    joinRoom(roomId, seat)
  ),
  dispatchLeaveRoom: (roomId) => dispatch(
    leaveRoom(roomId)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
