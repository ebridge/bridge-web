import styled from 'styled-components';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Form from '../modals/common/ModalForm';
import Input from '../modals/common/ModalInput';
import Checkbox from '../modals/common/ModalCheckbox';
import Button from '../modals/common/ModalButton';
import { breakpoints } from '../../lib/styleUtils';
import { PROFILE } from '../../constants/reducersConstants';
import { updateCheckbox, updateDate, updateText } from '../../redux/actions/formActions';
import { userUpdateProfile } from '../../redux/actions/userActions';

const ProfileSettings = ({
  userId,
  name,
  birthDate,
  birthDateIsPrivate,
  bio,
  conventions,
  location,
  profileUpdateState,
  dispatchUpdateText,
  dispatchUpdateProfile,
  dispatchUpdateBirthDate,
  dispatchTogglePrivateBirthDate,
}) => {
  const profile = {
    name,
    birthDate,
    birthDateIsPrivate,
    bio,
    conventions,
    location,
  };

  const onTextChange = (inputType, value) => {
    dispatchUpdateText(inputType, value);
  };

  const onSubmit = evt => {
    evt.preventDefault();
    dispatchUpdateProfile(userId, profile);
  };

  const setBirthDate = date => {
    const inputType = 'birthDate';
    dispatchUpdateBirthDate(inputType, date);
  };

  const setBirthDateIsPrivate = inputType => {
    dispatchTogglePrivateBirthDate(inputType, !birthDateIsPrivate);
  };

  const getStatusText = () => {
    switch (profileUpdateState) {
    case profileUpdateState.finished:
      return 'Update Successful';
    case profileUpdateState.pending:
      return 'Updating...';
    case profileUpdateState.error:
      return 'Error';
    default:
      return null;
    }
  };

  const statusText = getStatusText();

  return (
    <>
      <Form>
        <Input
          value={name || ''}
          placeholder='Your name'
          inputType='name'
          withLabel='Name'
          withInfoText='Will be displayed publicly on your profile'
          onTextChange={onTextChange}
        />
        <DatePickerContainer>
          <label>Birthday</label>
          <DatePicker
            placeholderText='mm/dd/yyyy'
            selected={Date.parse(birthDate)}
            onChange={setBirthDate}
            dateFormat='MM/dd/yyyy'
          />
        </DatePickerContainer>
        <Checkbox
          type='checkbox'
          label='Hide birthday from other users'
          inputType='birthDateIsPrivate'
          onChange={setBirthDateIsPrivate}
          checked={birthDateIsPrivate}
        />
        <Input
          value={bio || ''}
          placeholder='About me...'
          inputType='bio'
          isTextArea
          withLabel='Bio'
          onTextChange={onTextChange}
        />
        <Input
          value={conventions || ''}
          inputType='conventions'
          isTextArea
          withLabel='Conventions'
          withInfoText='Will be shown on your user card when a user clicks on your name'
          onTextChange={onTextChange}
        />
        <Input
          value={location || ''}
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
        <UpdateStatusText>{statusText}</UpdateStatusText>
      </ButtonAndStatusContainer>
    </>
  );
};

const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 1em;
  label {
    width: 100%;
  }
`;

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
  profileUpdateState: state?.api?.userUpdateProfileState,
  name: state?.profile?.name,
  birthDate: state?.profile?.birthDate,
  birthDateIsPrivate: state?.profile?.birthDateIsPrivate,
  bio: state?.profile?.bio,
  conventions: state?.profile?.conventions,
  location: state?.profile?.location,
});

const mapDispatchToProps = dispatch => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, PROFILE)
  ),
  dispatchUpdateProfile: (userId, profile) => dispatch(
    userUpdateProfile(userId, profile)
  ),
  dispatchUpdateBirthDate: (inputType, date) => dispatch(
    updateDate(inputType, date, PROFILE)
  ),
  dispatchTogglePrivateBirthDate: (inputType, value) => dispatch(
    updateCheckbox(inputType, value, PROFILE)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
