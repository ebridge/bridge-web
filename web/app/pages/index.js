import Link from 'next/link';
import styled from 'styled-components';
import GroupIcon from '@material-ui/icons/Group';
import LocalPlayIcon from '@material-ui/icons/LocalPlay';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { connect } from 'react-redux';
import PageWrapper from '../components/common/PageWrapper';
import { breakpoints } from '../lib/styleUtils';
import { LOGIN_MODAL, REGISTER_MODAL } from '../constants/modalConstants';
import { openModal } from '../redux/actions/modalActions';

const Index = ({ displayName, dispatchOpenModal }) => {
  const openLoginModal = () => {
    dispatchOpenModal(LOGIN_MODAL);
  };

  const openRegisterModal = () => {
    dispatchOpenModal(REGISTER_MODAL);
  };

  return (
    <PageWrapper displayName={displayName} flexDirection='column'>
      <Hero>
        <HeroText>
          <h1>Welcome to eBridge&nbsp;Club</h1>
          <h3>Free Online Contract Bridge</h3>
          {displayName
            ? <Link href='/dashboard'><LandingButton type='button'>Play Now</LandingButton></Link>
            : <>
              <LandingButton onClick={openLoginModal} type='button' muted>Login</LandingButton>
              <LandingButton onClick={openRegisterModal} type='button'>Sign Up For Free</LandingButton>
            </>
          }
        </HeroText>
      </Hero>
      <LandingInfoSection>
        <LandingInfoCard>
          <GroupIcon fontSize='large'/>
          <InfoCardTitle>
          Play&nbsp;With&nbsp;Friends
          </InfoCardTitle>
          <InfoCardText>
          Join a room and invite up to 3 friends to play bridge with.
          </InfoCardText>
        </LandingInfoCard>
        <LandingInfoCard>
          <LocalPlayIcon fontSize='large'/>
          <InfoCardTitle>
          Tournaments
          </InfoCardTitle>
          <InfoCardText>
          Tournaments every Saturday & Sunday. Test your skill against the best bridge players.
          </InfoCardText>
        </LandingInfoCard>
        <LandingInfoCard>
          <GroupAddIcon fontSize='large'/>
          <InfoCardTitle>
          Matchmaking
          </InfoCardTitle>
          <InfoCardText>
          Need a partner or opponents?<br/>Get automatically matched with other players looking for games.
          </InfoCardText>
        </LandingInfoCard>
      </LandingInfoSection>
    </PageWrapper>
  );
};

const Hero = styled.div`
  width: 100%;
  height: 35vh;
  min-height: 200px;
  position: relative;

  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('/hero-image.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  ${breakpoints.mobile} {
    height: 30vh;
  }
`;

const HeroText = styled.div`
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);

  font-family: ${({ theme }) => theme.fonts.quicksand};
  text-align: center;
  color: #fff;

  ${breakpoints.mobile} {
    width: 100%;
  }

  h1 {
    ${breakpoints.mobile} {
      font-size: 1.8em;
    }
  }
`;

const LandingButton = styled.button`
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  font-size: 1.2em;
  border: none;
  outline: none;
  padding: 10px 30px;
  margin: 0.2em 1em;
  font-family: ${({ theme }) => theme.fonts.quicksand};
  background-color: ${({ muted, theme }) => (muted ? theme.colors.grey : theme.colors.buttonGreen)};
`;

const LandingInfoSection = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const LandingInfoCard = styled.div`
  height: 50%;
  width: 400px;
  min-width: 240px;
  min-height: 240px;
  margin: 1em;

  border: 1px solid black;
  border-radius: 6px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2em;

  ${breakpoints.mobile} {
    width: 80%;
    margin-top: 0.8em;
  }
`;

const InfoCardTitle = styled.span`
  padding: 0 0.5em;
  color: #000;
  font-family: ${({ theme }) => theme.fonts.quicksand};
  font-size: 1.4em;
  
  ${breakpoints.mobile} {
    font-size: 1.2em;
  }
`;

const InfoCardText = styled.span`
  display: flex;
  flex: 1;
  align-items: center;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.quicksand};
`;


const mapDispatchToProps = dispatch => ({
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
});

export default connect(null, mapDispatchToProps)(Index);
