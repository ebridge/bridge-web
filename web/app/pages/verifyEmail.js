import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VerifyEmail = ({ displayName }) => (
  <>
    <Navbar
      height='8vh'
      displayName={displayName}
    />
    <h1>Todo: verify email page</h1>
    <Footer height='5vh'>
      <span>&copy; Copyright Ethan Bonsignori 2020</span>
    </Footer>
  </>
);


export default VerifyEmail;
