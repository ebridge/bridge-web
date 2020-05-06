import styled from 'styled-components';
import Navbar from './Navbar';
import Bridge from './bridge/Bridge';
import Footer from './Footer';
import { breakpoints } from '../lib/styleUtils';
import Chat from './Chat';

const Layout = () => (
  <>
    <Navbar height='8vh' />
    <FlexWrapper height='87vh'>
      <Bridge width='80vw' />
      <Chat width='20vw' />
    </FlexWrapper>
    <Footer height='5vh'>
      <span>&copy; Copyright Dirty E and the Boys 2020</span>
    </Footer>
  </>
);

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: ${props => props.height};

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

export default Layout;
