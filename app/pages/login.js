import { Component } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import withLandingLayout from '../components/landing/layout';
import LandingModal from '../components/landing/modal';
import LandingInput from '../components/landing/input';
import LandingButton from '../components/landing/button';

class Login extends Component {
  render() {
    return (
      <>
        <LandingModal title='Log in'>
          <LoginFormContent>
            <LandingInput type='email' placeholder='Email' />
            <LandingInput type='password' placeholder='Password' />
            <LandingButton label='Log in' />
            <LoginLinks>
              <Link href='/register'>
                <a>Create an account</a>
              </Link>
              <Link href='/forgot'>
                <a>Forgot your password?</a>
              </Link>
            </LoginLinks>
          </LoginFormContent>
        </LandingModal>
      </>
    );
  }
}

const LoginFormContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`;

const LoginLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
`;

export default withLandingLayout(Login);
