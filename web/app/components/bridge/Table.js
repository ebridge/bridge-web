import styled from 'styled-components';

const BridgeTable = () => (
  <BridgeTableWrapper>
    <TopAndBottomWrapper>
      <button>North</button>
    </TopAndBottomWrapper>
    <MiddleSeatWrapper>
      <button>West</button>
      <button>East</button>
    </MiddleSeatWrapper>
    <TopAndBottomWrapper>
      <button>South</button>
    </TopAndBottomWrapper>
  </BridgeTableWrapper>
);

const BridgeTableWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`;

const TopAndBottomWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const MiddleSeatWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

export default BridgeTable;
