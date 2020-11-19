import Link from 'next/link';
import PageWrapper from '../components/common/PageWrapper';

const Index = ({ displayName }) => (
  <PageWrapper displayName={displayName}>
    <Link href='/dashboard'><button>Play Bridge</button></Link>
  </PageWrapper>
);


export default Index;
