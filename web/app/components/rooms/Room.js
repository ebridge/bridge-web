import React from 'react';
import styled, { keyframes } from 'styled-components';
import { breakpoints } from '../../lib/styleUtils';

class Room extends React.Component {
  constructor() {
    super();

    this.state = {
      isExpanded: false,
    };
  }


  expandSeatOptions = () => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  joinRoom = seat => {
    const { dispatchJoinRoom } = this.props;
    const { roomId } = this.props.room;

    dispatchJoinRoom(roomId, seat);
  }

  leaveRoom = () => {
    const { dispatchLeaveRoom } = this.props;
    const { roomId } = this.props.room;

    dispatchLeaveRoom(roomId);
  }

  render() {
    const { room } = this.props;
    const { isExpanded } = this.state;
    return (
      <BridgeRoom>
        <BridgeRoomBanner>
          <span>Room {room.roomNumber}</span>
          <span>Players: {room?.usersInRoom}/4</span>
          <span>Status: Looking for more</span>
        </BridgeRoomBanner>
        <SitButton onClick={this.expandSeatOptions}>Sit</SitButton>

        <NorthButton
          disabled={room.users.N}
          onClick={() => this.joinRoom('N')}
          display={isExpanded ? 'block' : 'none'}>North
        </NorthButton>
        <EastButton
          disabled={room.users.E}
          onClick={() => this.joinRoom('E')}
          display={isExpanded ? 'block' : 'none'}>East
        </EastButton>
        <SouthButton
          disabled={room.users.S}
          onClick={() => this.joinRoom('S')}
          display={isExpanded ? 'block' : 'none'}>South
        </SouthButton>
        <WestButton
          disabled={room.users.W}
          onClick={() => this.joinRoom('W')}
          display={isExpanded ? 'block' : 'none'}>West
        </WestButton>

        <SittingPlayerN player={room.users.N} />
        <SittingPlayerE player={room.users.E} />
        <SittingPlayerS player={room.users.S} />
        <SittingPlayerW player={room.users.W} />

        {/* TODO: temporary leave room button */}
        <button style={{ position: 'absolute', right: 0, bottom: 0 }}
          onClick={this.leaveRoom}>(temp) Leave Room
        </button>
      </BridgeRoom>
    );
  }
}

const SittingPlayer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  margin: auto;

  width: 15px;
  height: 15px;
  border-radius: 50%;

  background: ${props => (props.player ? 'red' : 'green')};

  &::before {
    content: '${props => (props.player && props.player.displayName)}';
    color: white;
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
  }
`;
const SittingPlayerN = styled(SittingPlayer)`
  top: -130px;

  &::before {
    top: -10px;
  }
`;
const SittingPlayerE = styled(SittingPlayer)`
  left: 230px;

  &::before {
    top: -10px;
  }
`;
const SittingPlayerS = styled(SittingPlayer)`
  bottom: -150px;

  &::before {
    top: 30px;
  }
`;
const SittingPlayerW = styled(SittingPlayer)`
  right: 230px;

  &::before {
    top: -10px;
  }
`;

const BridgeRoomBanner = styled.div`
  width: 100%;
  height: 30px;
  background: white;
  position: absolute;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;


const BridgeRoom = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: ${props => props.theme.colors.lightGreen};
  width: 50%;
  height: 30%;
  border: 1px solid red;
  ${breakpoints.mobile} {
    min-height: 30vh;
    width: 100vw;
  }
`;

const SitButton = styled.button`
  cursor: pointer;
  border: block;
  outline: block;
  border-radius: 2px;
  padding: 0.2rem 0.8rem;
`;

const slideVertically = (y) => keyframes`
  0% {
    opacity: 0;
    top: 0;
    transform: scale(0);
  }
  1% {
    transform: scale(1);
  }
  100% {
    top: ${y};
    opacity: 1;
  }
`;

const slideHorizontally = (x) => keyframes`
  0% {
    opacity: 0;
    left: 0;
    transform: scale(0);
  }
  1% {
    transform: scale(1);
  }
  100% {
    left: ${x};
    opacity: 1;
  }
`;

const JoinButton = styled.button`
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  height: 20px;
  opacity: 0;

  cursor: pointer;
  border: none;
  outline: none;
  border-radius: 2px;
  padding: 0.2rem 0.8rem;

  animation-duration: 500ms;
  animation-iteration-count: 1;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;

  :disabled {
    display: none;
  }
`;

const NorthButton = styled(JoinButton)`
  display: ${props => props.display};
  animation-name: ${slideVertically('-80px')};
`;


const EastButton = styled(JoinButton)`
  display: ${props => props.display};
  animation-name: ${slideHorizontally('140px')};
`;


const SouthButton = styled(JoinButton)`
  display: ${props => props.display};
  animation-name: ${slideVertically('90px')};
`;

const WestButton = styled(JoinButton)`
  display: ${props => props.display};
  animation-name: ${slideHorizontally('-140px')};
`;

export default Room;
