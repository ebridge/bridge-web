import styled from 'styled-components';
import Footer from '../Footer';
import Navbar from '../Navbar';
import { breakpoints } from '../../lib/styleUtils';

const PageWrapper = ({
  displayName,
  title,
  flexDirection,
  children,
}) => (
  <FlexWrapper>
    <Navbar displayName={displayName} />
    <ContentFlexWrapper>
      <ContentPaddingPositioner>
        <PageTitle>{title}</PageTitle>
        <ContentContainer direction={flexDirection}>
          {children}
        </ContentContainer>
      </ContentPaddingPositioner>
    </ContentFlexWrapper>
    <Footer />
  </FlexWrapper>
);

/*
  Make the page full height and column
  positions nav and footer at top and bottom respectively,
  leaving the remaining room for any page content)
*/
const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

/*
  add a flex: 1 to the page content to make it use any remaining space,
  as well as centering the page horizontally
*/
const ContentFlexWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

/* adds padding to the main page content & makes it responsive */
const ContentPaddingPositioner = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2em;
  width: 80vw;

  ${breakpoints.mobile} {
    width: 100vw;
    padding: 0.5em;
    padding-bottom: 2em;
  }
`;

const PageTitle = styled.h1`
  /* TODO: style titles */
`;

/*
  contains main page content,
  changes direction based on flexDirection prop
*/
const ContentContainer = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => (direction || 'column')};
  flex: 1;
`;


export default PageWrapper;
