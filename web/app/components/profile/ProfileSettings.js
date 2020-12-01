import styled from 'styled-components';
import { connect } from 'react-redux';
import Form from '../modals/common/ModalForm';
import Input from '../modals/common/ModalInput';
import Button from '../modals/common/ModalButton';
import { breakpoints } from '../../lib/styleUtils';
import { updateText } from '../../redux/actions/formActions';
import { PROFILE } from '../../constants/reducersConstants';

const ProfileSettings = ({ dispatchUpdateText }) => {
  const onTextChange = (inputType, value) => {
    dispatchUpdateText(inputType, value);
  };
  return (
    <>
      <Form>
        <Input
          placeholder='Your name'
          inputType='name'
          withLabel='Name'
          withInfoText='Will be displayed publicly on your profile'
          onTextChange={onTextChange}
        />
        <Input
          placeholder='About me...'
          inputType='bio'
          isTextArea
          withLabel='Bio'
          onTextChange={onTextChange}
        />
        <Input
          inputType='conventions'
          isTextArea
          withLabel='Conventions'
          withInfoText='Will be shown on your user card when a user clicks on your name'
          onTextChange={onTextChange}
        />
        <Input
          inputType='location'
          withLabel='Location'
          withInfoText='Will be displayed publicly on your profile'
          onTextChange={onTextChange}
        />
      </Form>
      <ButtonAndStatusContainer>
        <Button width='50%' type='submit' boxShadow={true}>Update Profile</Button>
        {/* TODO: display api result here */}
        <UpdateStatusText>Update succesful</UpdateStatusText>
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

const mapDispatchToProps = dispatch => ({
  dispatchUpdateText: (inputType, value) => dispatch(
    updateText(inputType, value, PROFILE)
  ),
});

export default connect(null, mapDispatchToProps)(ProfileSettings);
