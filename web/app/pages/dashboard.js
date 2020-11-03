import { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
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

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatPosition: 'right',
    };
  }

  componentDidMount = () => {
    const { dispatchGetAllRooms, rooms } = this.props;
    if (!Array.isArray(rooms)) {
      dispatchGetAllRooms();
    }

    let chatPosition = localStorage.getItem('chatPosition');
    if (!chatPosition) {
      chatPosition = 'right';
      localStorage.setItem('chatPosition', 'right');
    }
    switch (chatPosition) {
    case 'left':
      return this.setState({ chatPosition: 'left' });
    default:
      return this.setState({ chatPosition: 'right' });
    }
  }

  setChatPosition = () => {
    const { chatPosition } = this.state;
    switch (chatPosition) {
    case 'right':
      localStorage.setItem('chatPosition', 'left');
      return this.setState({ chatPosition: 'left' });
    default:
      localStorage.setItem('chatPosition', 'right');
      return this.setState({ chatPosition: 'right' });
    }
  }

  render() {
    const { chatPosition } = this.state;
    const {
      displayName,
      dispatchJoinRoom,
      dispatchLeaveRoom,
      rooms,
    } = this.props;
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
            chatPosition={chatPosition}
            setChatPosition={this.setChatPosition}
          />
        </FlexWrapper>
        <Footer height='5vh'>
          <span>&copy; Copyright Ethan Bonsignori 2020</span>
        </Footer>
      </>
    );
  }
}


const FlexWrapper = styled.div`
  display: flex;
  flex-direction: ${({ chatPosition }) => (chatPosition === 'right' ? 'row' : 'row-reverse')};
  justify-content: right;
  min-height: ${props => props.height};

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const mapStateToProps = (state = fromJS({})) => {
  const rooms = state.get('rooms');
  return {
    rooms: rooms.get('rooms'),
  };
};

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
