import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import EditIcon from '@material-ui/icons/Edit';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import { connect } from 'react-redux';
import PageWrapper from '../../components/common/PageWrapper';
import { breakpoints } from '../../lib/styleUtils';
import { openModal } from '../../redux/actions/modalActions';
import { CROP_MODAL } from '../../constants/modalConstants';
import logger from '../../lib/logger';

const Profile = ({
  displayName,
  dispatchOpenModal,
}) => {
  const [isOpenEditPicture, setIsOpenEditPicture] = useState(false);

  const editPictureMenuRef = useRef(null);


  const handleOutsideClick = event => {
    if (editPictureMenuRef.current && !editPictureMenuRef.current.contains(event.target)) {
      setIsOpenEditPicture(false);
    }
  };

  const getBase64 = evt => {
    const reader = new FileReader();
    reader.readAsDataURL(evt.target.files[0]);
    // eslint-disable-next-line no-param-reassign
    evt.target.value = '';
    reader.onload = () => {
      dispatchOpenModal(CROP_MODAL, { image: reader.result });
    };
    reader.onerror = error => {
      logger.error(error);
    };
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  return (
    <PageWrapper
      displayName={displayName}
      flexDirection='row'
    >
      <ProfileMenuColumn>
      Menu placeholder
      </ProfileMenuColumn>
      <MainContentColumn>
        <SubHeader>Your Profile</SubHeader>
        <SettingsColumn>
          <ProfileSettingsColumn>
          </ProfileSettingsColumn>
          <ProfilePictureColumn>
            <ProfilePictureWrapper>
              Profile&nbsp;Picture
              <EditButton onClick={() => setIsOpenEditPicture(!isOpenEditPicture)}>
                <EditIcon />Edit
              </EditButton>
              <EditPictureMenu ref={editPictureMenuRef} isOpen={isOpenEditPicture}>
                <EditPictureMenuLabel onClick={() => setIsOpenEditPicture(false)} htmlFor='picture-upload'>
                  <PublishRoundedIcon />Upload Picture
                </EditPictureMenuLabel>
                {/* Profile Picture upload */}
                <input
                  id='picture-upload'
                  type='file'
                  accept='image/*'
                  onChange={(e) => getBase64(e)}
                  style={{ display: 'none ' }}
                />
                {/* Placeholder onClick */}
                <EditPictureMenuButton onClick={() => setIsOpenEditPicture(false)} type='button'>
                  <DeleteRoundedIcon />Remove Picture
                </EditPictureMenuButton>
              </EditPictureMenu>
              <ProfilePicture alt={displayName} src='https://place-hold.it/200x200' />
            </ProfilePictureWrapper>
          </ProfilePictureColumn>
        </SettingsColumn>
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
  display: flex;

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const ProfileSettingsColumn = styled(Col)`
  width: 80%;

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

const ProfilePictureWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  height: 220px;

  ${breakpoints.mobile} {
    height: 175px;
    width: 175px;
  }
`;

const ProfilePicture = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
  z-index: -1;

  ${breakpoints.mobile} {
    width: 150px;
    height: 150px;
  }
`;

const EditButton = styled.button`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  padding: 3px 6px;

  background: #fff;
  border: 1px solid grey;
  border-radius: 6px;


  &:hover {
    background: #e2e2e2;
  }

  &:active {
    background: #c1c1c1;
  }
`;

const EditPictureMenu = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'inline' : 'none')};
  position: absolute;
  bottom: -95px;
  left: 0;
  list-style: none;
  border: 1px solid grey;
  border-radius: 6px;
  max-width: 200px;
  min-width: 150px;
  padding: 0;
  margin: 0;

  label {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  button {
    border-top: 1px solid grey;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  `;

const EditPictureMenuButton = styled.button`
  cursor: pointer;
  background: #fff;
  width: 100%;
  border: none;
  padding: 0.8em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  font-size: 13px;
  font-family: Ariel, Helvetica, sans-serif;

  &:hover {
    background: #e2e2e2;
  }

  &:active {
    background: #c1c1c1;
  }
`;

const EditPictureMenuLabel = styled(EditPictureMenuButton)
  .attrs({ as: 'label' })``;

const mapDispatchToProps = dispatch => ({
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
});

export default connect(null, mapDispatchToProps)(Profile);
