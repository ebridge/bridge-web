import React from 'react';
import styled from 'styled-components';
import BridgeRoom from './Room';
import BridgeTable from './Table';


const tempRooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

class Bridge extends React.Component {
  render() {
    return (
      <>
        {tempRooms && tempRooms.map((room) => (
          <BridgeRoom key={room}>
            <span>Room {room}</span>
            <BridgeTable />
          </BridgeRoom>
        ))}
      </>
    );
  }
}


export default Bridge;
