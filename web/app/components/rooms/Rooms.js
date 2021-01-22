import React from 'react';
import styled from 'styled-components';
import Room from './Room';
import Spinner from '../common/Spinner';
import { breakpoints } from '../../lib/styleUtils';
import logger from '../../lib/logger';

class Rooms extends React.Component {
  render() {
    const {
      width,
      rooms,
      dispatchJoinRoom,
      dispatchLeaveRoom,
    } = this.props;
    if (!rooms || !rooms.length) {
      logger.warn('No rooms sent as props to Rooms component.');
      return <LoadingDiv width={width}>
        <Spinner height='50px' width='50px'/>
        <ReloadButton onClick={() => window.location.reload()}>Refresh</ReloadButton>
      </LoadingDiv>;
    }

    return (
      <RoomsWrapper width={this.props.width}>
        {rooms && rooms.map((room) => (
          <Room
            key={room.roomId}
            room={room}
            dispatchJoinRoom={dispatchJoinRoom}
            dispatchLeaveRoom={dispatchLeaveRoom}
          />
        ))}
      </RoomsWrapper>
    );
  }
}

const RoomsWrapper = styled.div`
  background: ${props => props.theme.colors.green};
  max-width: ${props => props.width};
  
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;

  /* Scrollbar */
  &::-webkit-scrollbar {
    display: ${({ isScrolledToBottom }) => (isScrolledToBottom ? 'none' : 'block')};
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: none;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 6px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }

  ${breakpoints.mobile} {
    width: 100vw;
    max-width: 100vw;
    height: 41vh;
  }
`;

const LoadingDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${props => props.width};
`;

const ReloadButton = styled.button`
  margin: 2rem;
`;


export default Rooms;
