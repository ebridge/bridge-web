import { useState } from 'react';
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
  apiError,
  apiPending,
  apiFinished,
  dispatchUpdateText,
  dispatchUpdateProfile,
  dispatchUpdateBirthDate,
  dispatchTogglePrivateBirthDate,
}) => {
  const [hasUpdated, setHasUpdated] = useState(false);

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
    return setHasUpdated(true);
  };

  const setBirthDate = date => {
    const inputType = 'birthDate';
    dispatchUpdateBirthDate(inputType, date);
  };

  const setBirthDateIsPrivate = inputType => {
    dispatchTogglePrivateBirthDate(inputType, !birthDateIsPrivate);
  };


  const isLoading = apiPending && !apiError;

  const getStatusText = () => {
    if (apiFinished && !apiError) {
      return 'Profile updated!';
    }
    if (isLoading) {
      return 'Loading...';
    }
    if (apiError) {
      return apiError;
    }
    return null;
  };

  return (
    <>
      <Form>
        <StatusText error={apiError}>{hasUpdated && getStatusText()}</StatusText>
        <Input
          value={name || ''}
          placeholder='Your name'
          inputType='name'
          withLabel='Name'
          withInfoText='Will be displayed publicly on your profile'
          onTextChange={onTextChange}
          isLoading={isLoading}
        />
        <DatePickerContainer>
          <label>Birthday</label>
          <DatePicker
            placeholderText='mm/dd/yyyy'
            selected={Date.parse(birthDate)}
            onChange={setBirthDate}
            dateFormat='MM/dd/yyyy'
            disabled={isLoading}
          />
        </DatePickerContainer>
        <Checkbox
          type='checkbox'
          label='Hide birthday from other users'
          inputType='birthDateIsPrivate'
          onChange={setBirthDateIsPrivate}
          checked={birthDateIsPrivate}
          isLoading={isLoading}
        />
        <Input
          value={bio || ''}
          placeholder='About me...'
          inputType='bio'
          isTextArea
          withLabel='Bio'
          onTextChange={onTextChange}
          isLoading={isLoading}
        />
        <Input
          value={conventions || ''}
          inputType='conventions'
          isTextArea
          withLabel='Conventions'
          withInfoText='Will be shown on your user card when a user clicks on your name'
          onTextChange={onTextChange}
          isLoading={isLoading}
        />
        <Input
          value={location || ''}
          inputType='location'
          withLabel='Location'
          withInfoText='Will be displayed publicly on your profile'
          onTextChange={onTextChange}
          isLoading={isLoading}
        />
      </Form>
      <Button
        width='50%'
        type='submit'
        boxShadow={true}
        onClick={onSubmit}
        isLoading={isLoading}
      >
          Update Profile
      </Button>
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

const StatusText = styled.span`
  color: ${({ error }) => (error ? 'red' : 'green')};
  width: 50%;
  font-weight: bold;

  ${breakpoints.mobile} {
    width: 100%;
    text-align: center;
  }
`;

const mapStateToProps = (state = {}) => ({
  apiError: state?.api?.userUpdateProfileState?.error,
  apiPending: state?.api?.userUpdateProfileState?.pending,
  apiFinished: state?.api?.userUpdateProfileState?.finished,
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
