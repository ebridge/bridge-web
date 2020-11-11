import styled from 'styled-components';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Index = ({ displayName }) => (
  <FlexWrapper>
    <Navbar displayName={displayName} />
    <PageContent>
      <ContentWrapper>
        <Link href='/dashboard'><button>Play Bridge</button></Link>
      </ContentWrapper>
    </PageContent>
    <Footer />
  </FlexWrapper>
);

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const PageContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.1);
  padding: 2em;
  width: 80vw;
`;

export default Index;
