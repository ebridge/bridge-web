import { useEffect } from 'react';
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

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       chatPosition: 'right',
//     };
//   }

//   componentDidMount = () => {
//     console.log(this.props);
//     // const store = useStore();

//     const { dispatchGetAllRooms, rooms } = this.props;
//     if (!Array.isArray(rooms) || !rooms.length) {
//       dispatchGetAllRooms();
//     }

//     let chatPosition = localStorage.getItem('chatPosition');
//     if (!chatPosition) {
//       chatPosition = 'right';
//       localStorage.setItem('chatPosition', 'right');
//     }
//     switch (chatPosition) {
//     case 'left':
//       return this.setState({ chatPosition: 'left' });
//     default:
//       return this.setState({ chatPosition: 'right' });
//     }
//   }

//   setChatPosition = () => {
//     const { chatPosition } = this.state;
//     switch (chatPosition) {
//     case 'right':
//       localStorage.setItem('chatPosition', 'left');
//       return this.setState({ chatPosition: 'left' });
//     default:
//       localStorage.setItem('chatPosition', 'right');
//       return this.setState({ chatPosition: 'right' });
//     }
//   }

//   render() {
//     const { chatPosition } = this.state;
//     const {
//       displayName,
//       dispatchJoinRoom,
//       dispatchLeaveRoom,
//       rooms,
//     } = this.props;
//     return (
//       <>
//         <Navbar
//           height='8vh'
//           displayName={displayName}
//         />
//         <FlexWrapper height='87vh' chatPosition={chatPosition}>
//           <Rooms
//             width='80vw'
//             rooms={rooms}
//             dispatchJoinRoom={dispatchJoinRoom}
//             dispatchLeaveRoom={dispatchLeaveRoom}
//           />
//           <Chat
//             width='20vw'
//             chatPosition={chatPosition}
//             setChatPosition={this.setChatPosition}
//           />
//         </FlexWrapper>
//         <Footer height='5vh'>
//           <span>&copy; Copyright Ethan Bonsignori 2020</span>
//         </Footer>
//       </>
//     );
//   }
// }
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
  const chatPosition = 'right';

  useEffect(() => {
    dispatchGetAllRooms();
  }, []);

  return (
    <>
      <Navbar
        height='8vh'
        displayName={displayName}
      />
      <FlexWrapper height='87vh' chatPosition={chatPosition}>
        <Rooms
          width='80vw'
          rooms={rooms}
          dispatchJoinRoom={dispatchJoinRoom}
          dispatchLeaveRoom={dispatchLeaveRoom}
        />
        <Chat
          width='20vw'
          socket={socket}
          chatPosition={chatPosition}
          displayName={displayName}
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
