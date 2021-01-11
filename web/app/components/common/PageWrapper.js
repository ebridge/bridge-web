import Head from 'next/head';
import styled from 'styled-components';
import Footer from '../Footer';
import Navbar from '../Navbar';
import { breakpoints } from '../../lib/styleUtils';

const PageWrapper = ({
  displayName,
  headTitle,
  title,
  flexDirection,
  children,
  withPositioner,
  withFooter,
}) => (
  <>
    <Head><title>{headTitle || 'eBridge Club'}</title></Head>
    <FlexWrapper>
      <Navbar displayName={displayName} />
      <ContentFlexWrapper direction={flexDirection}>
        {withPositioner
          ? <ContentPaddingPositioner>
            {title ? <PageTitle>{title}</PageTitle> : null}
            <ContentContainer direction={flexDirection}>
              {children}
            </ContentContainer>
          </ContentPaddingPositioner>
          : children}
      </ContentFlexWrapper>
      {withFooter
        ? <Footer />
        : null}
    </FlexWrapper>
  </>
);

/*
  Make the page full height and column
  positions nav and footer at top and bottom respectively,
  leaving the remaining room for any page content)
*/
const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  height: 100vh;
  overflow-x: hidden;

  ${breakpoints.mobile} {
    min-height: 100vh;
    height: unset;
  }
`;

/*
  add a flex: 1 to the page content to make it use any remaining space,
  as well as centering the page horizontally
*/
const ContentFlexWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow-x: hidden;
  flex-direction: ${({ direction }) => (direction || 'column')};
  justify-content: center;

  ${breakpoints.mobile} {
    flex-direction: column;
    overflow-x: scroll;
  }
`;

/* adds padding to the main page content & makes it responsive */
const ContentPaddingPositioner = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2em;
  width: 60vw;

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
  /* flex: 1; */

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;


export default PageWrapper;
