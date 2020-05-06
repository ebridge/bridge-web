import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../lib/styleUtils';
import BridgeRoom from './Room';
import BridgeTable from './Table';


const tempRooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

class Bridge extends React.Component {
  render() {
    return (
      <BridgeWrapper width={this.props.width}>
        {tempRooms && tempRooms.map((room) => (
          <BridgeRoom key={room}>
            <span>Room {room}</span>
            <BridgeTable />
          </BridgeRoom>
        ))}
      </BridgeWrapper>
    );
  }
}

const BridgeWrapper = styled.div`
  background: ${props => props.theme.colors.green};
  
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: auto;

  width: ${props => props.width};

  ${breakpoints.mobile} {
    width: 100vw;
    max-height: 50vh;
  }
`;
export default Bridge;
