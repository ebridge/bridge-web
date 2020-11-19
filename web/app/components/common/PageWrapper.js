import styled from 'styled-components';
import Footer from '../Footer';
import Navbar from '../Navbar';
import { breakpoints } from '../../lib/styleUtils';

const PageWrapper = ({
  displayName,
  children,
}) => (
  <FlexWrapper>
    <Navbar displayName={displayName} />
    <ContentWrapper>
      <ContentContainer>
        {children}
      </ContentContainer>
    </ContentWrapper>
    <Footer />
  </FlexWrapper>
);

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.1);
  padding: 2em;
  width: 80vw;

  ${breakpoints.mobile} {
    width: 100vw;
    padding: 0.5em;
    padding-bottom: 2em;
  }
`;


export default PageWrapper;
