import styled from 'styled-components';
import Navbar from './Navbar';
import Bridge from './bridge/Bridge';
import { breakpoints } from '../lib/styleUtils';
import Chat from './Chat';

const Layout = () => (
  <>
    <Navbar />
    <FlexWrapper>
      <ContentWrapper>
        <Bridge />
      </ContentWrapper>
      <Chat />
    </FlexWrapper>
    <Footer>
      <h1>Footer</h1>
    </Footer>
  </>
);

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const ContentWrapper = styled.div`
  background: red;
  
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 80vw;
  
  max-height: 90vh;
  overflow: auto;

  ${breakpoints.mobile} {
    width: 100vw;
    max-height: 50vh;
  }
`;

const Footer = styled.div`
  display: flex;
  width: 100vw;
  background: purple;
`;

export default Layout;
