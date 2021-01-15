import { useEffect, useState } from 'react';
import { connect, useStore } from 'react-redux';
import Router from 'next/router';
import PageWrapper from '../components/common/PageWrapper';
import Rooms from '../components/rooms/Rooms';
import Chat from '../components/chat/Chat';
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
  profile,
  dispatchGetAllRooms,
  dispatchJoinRoom,
  dispatchLeaveRoom,
  rooms,
}) => {
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
    if (!userId) { // When user is not logged in
      Router.replace('/');
    }
    dispatchGetAllRooms();
    setTimeout(setPreventRender(false), 200);
  }, []);

  if (preventRender) {
    return null;
  }
  return (
    <PageWrapper
      displayName={displayName}
      flexDirection='row'
      headTitle='eBridge Club - Play Bridge'
    >
      <Rooms
        width='70vw'
        rooms={rooms}
        dispatchJoinRoom={dispatchJoinRoom}
        dispatchLeaveRoom={dispatchLeaveRoom}
      />
      <Chat
        width='30vw'
        socket={socket}
        displayName={displayName}
        profile={profile}
        isChatRight={isChatRight}
        setIsChatRight={setIsChatRight}
      />
    </PageWrapper>
  );
};

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
