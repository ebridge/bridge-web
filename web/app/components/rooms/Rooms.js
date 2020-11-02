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
        <Spinner height='100px' width='100px'/>
        <button onClick={() => window.location.reload()}>Refresh</button>
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
  width: ${props => props.width};
  
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;

  ${breakpoints.mobile} {
    width: 100vw;
    max-height: 50vh;
  }
`;

const LoadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.width};
`;


export default Rooms;