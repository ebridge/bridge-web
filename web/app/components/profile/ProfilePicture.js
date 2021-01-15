import {
  useState, useRef, useEffect, useCallback,
} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import EditIcon from '@material-ui/icons/Edit';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import { openModal } from '../../redux/actions/modalActions';
import { CROP_MODAL } from '../../constants/modalConstants';
import logger from '../../lib/logger';
import { breakpoints } from '../../lib/styleUtils';

const ProfilePicture = ({
  userId,
  displayName,
  dispatchOpenModal,
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
      });
    };
    reader.onerror = error => {
      logger.error(error);
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
        {/* Placeholder onClick */}
        <RemovePictureButton onClick={() => toggleMenu(false)} type='button'>
          <DeleteRoundedIcon />Remove Picture
        </RemovePictureButton>
      </PictureMenu>
      <ProfilePictureImg alt={displayName} src='https://place-hold.it/200x200' />
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

const ProfilePictureImg = styled.img`
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

const mapDispatchToProps = dispatch => ({
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
});

export default connect(null, mapDispatchToProps)(ProfilePicture);
