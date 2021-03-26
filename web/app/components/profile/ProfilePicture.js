import {
  useState, useRef, useEffect, useCallback,
} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import { putRequest } from '../../redux/service';
import { openModal } from '../../redux/actions/modalActions';
import { userSetProfilePictureUrl } from '../../redux/actions/userActions';
import { CONFIRM_MODAL, CROP_MODAL, STATE_MODAL } from '../../constants/modalConstants';
import uploadProfilePicture from '../../lib/uploadProfilePicture';
import logger from '../../lib/logger';
import { breakpoints } from '../../lib/styleUtils';

const ProfilePicture = ({
  userId,
  displayName,
  profilePictureUrl,
  apiError,
  // apiPending,
  // apiFinished,
  dispatchOpenModal,
  dispatchSetProfilePictureUrl,
  userSetProfilePictureUrlState,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = (value = null) => {
    if (value !== null) {
      return setIsMenuOpen(value);
    }
    return useCallback(
      () => setIsMenuOpen(!isMenuOpen),
      [isMenuOpen, setIsMenuOpen]
    );
  };

  const pictureRef = useRef(null);

  // Close edit picture menu if clicked outside
  const handleOutsideClick = event => {
    if (pictureRef.current && !pictureRef.current.contains(event.target)) {
      toggleMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const switchToStateModal = message => {
    dispatchOpenModal(STATE_MODAL, {
      message,
    });
  };

  const isApiError = apiError;
  const setProfilePictureUrl = async (url = 'deleted') => {
    await dispatchSetProfilePictureUrl(userId, url);
    const setOrDeleted = url === 'deleted' ? 'delete' : 'set';
    let message = `Successfully ${setOrDeleted} profile picture.`;
    if (isApiError) {
      message = <>
        Error editing profile picture.
        <br /><br />
        Please try again.
        <br /><br />
        {userSetProfilePictureUrlState.error}
      </>;
    }
    switchToStateModal(message);
  };

  const uploadPictureAndGetUrl = async (filename, base64Img) => {
    try {
      // Get url
      const { pictureUploadUrl } = await putRequest(`/users/picture-url/${userId}`, { filename });
      // Upload to url
      const finalUrl = await uploadProfilePicture(pictureUploadUrl, base64Img);
      // Set url in DB
      setProfilePictureUrl(finalUrl);
    } catch (err) {
      logger.error(err);
    }
  };

  const deleteProfilePicture = async () => {
    setProfilePictureUrl('deleted');
  };

  const openConfirmModal = () => {
    dispatchOpenModal(CONFIRM_MODAL, {
      userId,
      message: <>Are you sure you want to delete your profile picture?<br /><br />This can&apos;t be undone.</>,
      confirmClick: deleteProfilePicture,
    });
  };


  // Convert uploaded picture to Base64 and send it to the crop modal
  const getBase64 = evt => {
    const file = evt.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    // eslint-disable-next-line no-param-reassign
    evt.target.value = ''; // reset value so onChange will register
    reader.onload = () => {
      dispatchOpenModal(CROP_MODAL, {
        userId,
        filename: file.name,
        image: reader.result,
        uploadPictureAndGetUrl,
      });
    };
    reader.onerror = err => {
      logger.error(err);
    };
  };

  return (
    <ProfilePictureWrapper ref={pictureRef} onClick={() => toggleMenu(!isMenuOpen)}>
      Profile&nbsp;Picture
      <EditButton onClick={() => toggleMenu(!isMenuOpen)}>
        <EditIcon />Edit
      </EditButton>
      <PictureMenu isOpen={isMenuOpen}>
        <PictureMenuLabel onClick={() => toggleMenu(false)} htmlFor='picture-upload'>
          <PublishRoundedIcon />Upload Picture
        </PictureMenuLabel>
        {/* Profile Picture upload */}
        <input
          id='picture-upload'
          type='file'
          accept='image/*'
          onChange={(e) => getBase64(e)}
          style={{ display: 'none ' }}
        />
        <RemovePictureButton onClick={openConfirmModal} type='button'>
          <DeleteRoundedIcon />Remove Picture
        </RemovePictureButton>
      </PictureMenu>
      <ProfilePictureImg alt={displayName} src={profilePictureUrl} />
    </ProfilePictureWrapper>
  );
};

const ProfilePictureWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: left;
  flex-direction: column;
  position: relative;
  height: 220px;

  ${breakpoints.mobile} {
    align-items: center;
    height: 175px;
    width: 175px;
  }
`;

const ProfilePictureImg = styled(Avatar)`
  /* Override Material-ui defaults */
  width: 200px !important;
  height: 200px !important;
  position: relative !important;
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
`;

const PictureMenu = styled.div`
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
  z-index: 9999;

  button {
    border-top: 1px solid grey;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const RemovePictureButton = styled.button`
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

const PictureMenuLabel = styled(RemovePictureButton).attrs({ as: 'label' })`
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

const mapStateToProps = (state = {}) => ({
  apiError: state?.api?.userSetProfilePictureUrlState?.error,
  apiPending: state?.api?.userSetProfilePictureUrlState?.pending,
  apiFinished: state?.api?.userSetProfilePictureUrlState?.finished,
});

const mapDispatchToProps = dispatch => ({
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
  dispatchSetProfilePictureUrl: (userId, url) => dispatch(
    userSetProfilePictureUrl(userId, url)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePicture);
