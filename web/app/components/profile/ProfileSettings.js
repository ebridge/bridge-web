import styled from 'styled-components';
import { connect } from 'react-redux';
import Form from '../modals/common/ModalForm';
import Input from '../modals/common/ModalInput';
import Button from '../modals/common/ModalButton';
import { breakpoints } from '../../lib/styleUtils';
import { updateText } from '../../redux/actions/formActions';
import { PROFILE } from '../../constants/reducersConstants';
import { userUpdateProfile } from '../../redux/actions/userActions';

const ProfileSettings = ({
  id,
  name,
  bio,
  conventions,
  location,
  updateProfileState,
  dispatchUpdateText,
  dispatchUpdateProfile,
}) => {
  const profile = {
    id,
    name,
    bio,
    conventions,
  };

  const onTextChange = (inputType, value) => {
    dispatchUpdateText(inputType, value);
  };

  const onSubmit = evt => {
    evt.preventDefault();
    dispatchUpdateProfile(id, profile);
  };

  const statusText = () => {
    switch (updateProfileState) {
    case updateProfileState.finished:
      return 'Update Successful';
    case updateProfileState.pending:
      return 'Updating...';
    case updateProfileState.error:
      return 'Error';
    default:
      return null;
    }
  };
  return (
    <>
      <Form>
        <Input
          value={name}
          placeholder='Your name'
          inputType='name'
          withLabel='Name'
          withInfoText='Will be displayed publicly on your profile'
          onTextChange={onTextChange}
        />
        <Input
          value={bio}
          placeholder='About me...'
          inputType='bio'
          isTextArea
          withLabel='Bio'
          onTextChange={onTextChange}
        />
        <Input
          value={conventions}
          inputType='conventions'
          isTextArea
          withLabel='Conventions'
          withInfoText='Will be shown on your user card when a user clicks on your name'
          onTextChange={onTextChange}
        />
        <Input
          value={location}
          inputType='location'
          withLabel='Location'
          withInfoText='Will be displayed publicly on your profile'
          onTextChange={onTextChange}
        />
      </Form>
      <ButtonAndStatusContainer>
        <Button
          width='50%'
          type='submit'
          boxShadow={true}
          onClick={onSubmit}
        >
          Update Profile
        </Button>
        {/* TODO: display api result here */}
        <UpdateStatusText>{statusText}</UpdateStatusText>
      </ButtonAndStatusContainer>
    </>
  );
};

const ButtonAndStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const UpdateStatusText = styled.span`
  color: green;
  width: 50%;
  padding-left: 1em;

  ${breakpoints.mobile} {
    width: 100%;
    text-align: center;
  }
`;

const mapStateToProps = (state = {}) => ({
  updateProfileState: state?.api?.userUpdateProfileState,
  name: state?.profile?.name,
  bio: state?.profile?.bio,
  conventions: state?.profile?.conventions,
  location: state?.profile?.location,
});

const mapDispatchToProps = dispatch => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, PROFILE)
  ),
  dispatchUpdateProfile: (id, profile) => dispatch(
    userUpdateProfile(id, profile)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
