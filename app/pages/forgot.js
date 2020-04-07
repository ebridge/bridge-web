import Link from 'next/link';
import withLandingLayout from '../components/landing/layout';
import LandingModal from '../components/landing/modal';
import LandingModalLinks from '../components/landing/modalLinks';
import LandingInput from '../components/landing/input';
import LandingButton from '../components/landing/button';

const Forgot = () => (
  <>
    <LandingModal title='Reset Password'>
      <LandingInput type='email' placeholder='Enter your email' />
      <LandingButton label='Send me a Link' />
      <LandingModalLinks>
        <Link href='login'>
          <a>Remembered your account? Log in</a>
        </Link>
        <Link href='register'>
          <a>Create new account</a>
        </Link>
      </LandingModalLinks>
    </LandingModal>
  </>
);

export default withLandingLayout(Forgot);
