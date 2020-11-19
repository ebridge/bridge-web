import styled from 'styled-components';
import EditIcon from '@material-ui/icons/Edit';
import PageWrapper from '../../components/common/PageWrapper';

const Profile = ({
  displayName,
}) => (
  <PageWrapper displayName={displayName}>
    <h1>Your Profile</h1>
    <ProfilePictureContainer>
      Profile Picture
      <EditIconWrapper>
        <EditIcon /> Edit
      </EditIconWrapper>
      <ProfilePicture />
    </ProfilePictureContainer>
  </PageWrapper>
);

const ProfilePictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ProfilePicture = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: grey;
`;

const EditIconWrapper = styled.div`
  position: absolute;
  bottom: 0;

  display: flex;
  align-items: center;
  padding: 3px 6px;

  background: white;
  border: 1px solid grey;
  border-radius: 6px;
`;

export default Profile;
