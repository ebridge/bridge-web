import Link from 'next/link';
import styled from 'styled-components';
import { breakpoints } from '../lib/styleUtils';
import LandingLayout from '../components/landing/layout';

const Landing = () => (
  <LandingLayout>
    <ContentWrapper>
      <LogoWrapper>
        <LogoText>Bridge Online</LogoText>
      </LogoWrapper>
      <Link href='/login'>
        <Button>Login</Button>
      </Link>
      <Link href='/register'>
        <Button>Sign Up</Button>
      </Link>
    </ContentWrapper>
  </LandingLayout>
);

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const LogoText = styled.span`
  color: #fff;
  font-size: 6vw;

  ${breakpoints.mobile} {
    font-size: 10vw;
    margin-bottom: 10vh;
  }
`;

const Button = styled.button`
  cursor: pointer;
  color: #fff;
  background: none;
  width: 10vw;
  padding: 15px 0;
  /* padding: 15px 5vw; */
  margin: 10px;
  border: 2px solid #fff;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  ${breakpoints.mobile} {
    width: 80vw;
  }
`;

export default Landing;
