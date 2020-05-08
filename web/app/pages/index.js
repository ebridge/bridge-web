import Link from 'next/link';
import Navbar from '../components/Navbar';

const Index = () => (
  <>
    <Navbar />
    <Link href='/dashboard'><button>Play Bridge</button></Link>
  </>
);

export default Index;
