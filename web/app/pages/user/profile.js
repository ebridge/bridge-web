import { connect } from 'react-redux';
import styled from 'styled-components';
import PageWrapper from '../../components/common/PageWrapper';
import { breakpoints } from '../../lib/styleUtils';
import ProfileSettings from '../../components/profile/ProfileSettings';
import ProfilePicture from '../../components/profile/ProfilePicture';


const Profile = ({
  displayName,
}) => (
  <PageWrapper
    displayName={displayName}
    flexDirection='row'
    headTitle='Profile'
  >
    <ProfileMenuColumn>
      Menu placeholder
    </ProfileMenuColumn>
    <MainContentColumn>
      <SubHeader>Your Profile</SubHeader>
      <SettingsColumn>
        <ProfileSettingsColumn>
          <ProfileSettings />
        </ProfileSettingsColumn>
        <ProfilePictureColumn>
          <ProfilePicture displayName={displayName}/>
        </ProfilePictureColumn>
      </SettingsColumn>
    </MainContentColumn>
  </PageWrapper>
);

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

const MainContentColumn = styled(Col)`
  width: 75%;
`;

const SubHeader = styled.h2`
  margin-top: 0;

  font-weight: 1;
  padding-bottom: 10px;
  border-bottom: 1px solid grey;
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

// Temp null values
export default connect(null, null)(Profile);
