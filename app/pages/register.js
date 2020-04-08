import Link from 'next/link';
import withLandingLayout from '../components/landing/layout';
import LandingModal from '../components/landing/modal';
import LandingModalLinks from '../components/landing/modalLinks';
import LandingInput from '../components/landing/input';
import LandingButton from '../components/landing/button';

const Register = () => (
  <>
    <LandingModal title='Sign up'>
      <LandingInput name='email' type='email' placeholder='Email'/>
      <LandingInput name='display' type='text' placeholder='Display Name'/>
      <LandingInput name='password' type='password' placeholder='Password'/>
      <LandingInput name='password repeat' type='password' placeholder='Repeat Password'/>
      <LandingButton label='Register' />
      <LandingModalLinks>
        <Link href='login'>
          <a>Already have an account? Log in</a>
        </Link>
      </LandingModalLinks>
    </LandingModal>
  </>
);

export default withLandingLayout(Register);
