import { useEffect, useState } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PageWrapper from '../../components/common/PageWrapper';
import { breakpoints } from '../../lib/styleUtils';
import ProfileSettings from '../../components/profile/ProfileSettings';
import ProfilePicture from '../../components/profile/ProfilePicture';
import AccountSettings from '../../components/profile/AccountSettings';
import { PROFILE } from '../../constants/reducersConstants';
import { setStateFromProps } from '../../redux/actions/formActions';

const Profile = ({
  userId,
  profile,
  displayName,
  dispatchSetStateFromProps,
}) => {
  useEffect(() => {
    setTimeout(() => { dispatchSetStateFromProps(profile); }, 1);
  }, []);

  const [activeSection, setActiveSection] = useState('profile');

  const profileSettings = <>
    <SubHeader>Your Profile</SubHeader>
    <SettingsColumn>
      <ProfileSettingsColumn>
        <ProfileSettings userId={userId} />
      </ProfileSettingsColumn>
      <ProfilePictureColumn>
        <ProfilePicture
          userId={userId}
          displayName={displayName}
          profilePictureUrl={profile.profilePictureUrl}
        />
      </ProfilePictureColumn>
    </SettingsColumn>
  </>;

  const accountSettings = <>
    <SubHeader>Change Password</SubHeader>
    <SettingsColumn>
      <ProfileSettingsColumn>
        <AccountSettings userId={userId} />
      </ProfileSettingsColumn>
    </SettingsColumn>
  </>;

  const matchHistory = <>
    <SubHeader>Match History</SubHeader>
  </>;

  const socialSettings = <>
    <SubHeader>Social Settings</SubHeader>
  </>;

  let activeSectionJsx = profileSettings;
  switch (activeSection) {
  case 'history':
    activeSectionJsx = matchHistory;
    break;
  case 'account':
    activeSectionJsx = accountSettings;
    break;
  case 'social':
    activeSectionJsx = socialSettings;
    break;
  case 'profile':
  default:
    activeSectionJsx = profileSettings;
    break;
  }

  return (
    <PageWrapper
      displayName={displayName}
      profile={profile}
      flexDirection='row'
      headTitle='Profile'
      withPositioner
    >
      <ProfileMenuColumn>
        <ProfileMenu>
          <ProfileMenuSection>
            <ProfileMenuButton section='none' onClick={() => Router.push('/dashboard')}>
              <ArrowBackIcon /> Back to Dashboard
            </ProfileMenuButton>
          </ProfileMenuSection>
          <ProfileMenuButton
            activeSection={activeSection}
            section='profile'
            onClick={() => setActiveSection('profile')}
          >
            Profile Settings
          </ProfileMenuButton>
          <ProfileMenuButton
            activeSection={activeSection}
            section='account'
            onClick={() => setActiveSection('account')}
          >
            Account Settings
          </ProfileMenuButton>
          <ProfileMenuButton
            activeSection={activeSection}
            section='history'
            onClick={() => setActiveSection('history')}
          >
            Match History
          </ProfileMenuButton>
          <ProfileMenuButton
            activeSection={activeSection}
            section='social'
            onClick={() => setActiveSection('social')}
          >
            Social Settings
          </ProfileMenuButton>
        </ProfileMenu>
      </ProfileMenuColumn>
      <MainContentColumn>
        {activeSectionJsx}
      </MainContentColumn>
    </PageWrapper>
  );
};

const Col = styled.div`
  height: 100%;
  padding: 0 12px;

  ${breakpoints.mobile} {
    width: 100%;
    padding: 0 6px;
  }
`;

const ProfileMenuColumn = styled(Col)`
  width: 25%;
`;

const ProfileMenu = styled.div`
  display: flex;
  flex-direction: column;

  border: 1px solid grey;
  border-radius: 6px;
`;

const ProfileMenuSection = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid grey;
`;

const ProfileMenuButton = styled.button`
  cursor: pointer;
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.quicksand};
  text-decoration: ${props => (props.activeSection === props.section ? 'underline' : 'none')};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${props => (props.activeSection === props.section ? props.theme.colors.lightGrey : '#fff')};
  border: none;
  outline: none;
  padding: 1em;
  margin: 0.3em 0;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.buttonGreen};
  }
`;

const MainContentColumn = styled(Col)`
  width: 75%;
`;

const SubHeader = styled.h2`
  margin-top: 0;

  font-weight: 1;
  padding-bottom: 10px;
  border-bottom: 1px solid grey;

  ${breakpoints.mobile} {
    text-align: center;
    margin-top: 1em;
  }
`;

const SettingsColumn = styled(Col)`
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: space-between;

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const ProfileSettingsColumn = styled(Col)`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding-right: 50px;
  ${breakpoints.mobile} {
    order: 2;
  }
`;

const ProfilePictureColumn = styled(Col)`
  width: 20%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;

  ${breakpoints.mobile} {
    order: 1;
    padding-bottom: 12px;
  }
`;

const mapDispatchToProps = dispatch => ({
  dispatchSetStateFromProps: data => dispatch(
    setStateFromProps(data, PROFILE)
  ),
});

export default connect(null, mapDispatchToProps)(Profile);
