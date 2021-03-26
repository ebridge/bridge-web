import { connect } from 'react-redux';
import styled from 'styled-components';
import { closeModal } from '../../redux/actions/modalActions';

const ConfirmModal = modalProps => {
  const handleClose = () => {
    modalProps.dispatchCloseModal();
  };

  return (
    <>
      <Message>
        {modalProps.message || 'Are you sure?'}
      </Message>
      <ButtonsWrapper>
        <ConfirmModalButton onClick={handleClose}>
          Cancel
        </ConfirmModalButton>
        <ConfirmButton onClick={modalProps.confirmClick}>Confirm</ConfirmButton>
      </ButtonsWrapper>
    </>
  );
};

const Message = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  align-items: center;
  text-align: center;
  font-size: 2em;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ConfirmModalButton = styled.button`
  cursor: pointer;
  width: 40%;
  height: 3rem;
  margin: 2em;
  background: grey;
  border: none;
  outline: none;

  font-family: ${props => props.theme.fonts.quicksand};
  font-size: 1.2em;
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.9;
  }
`;

const ConfirmButton = styled(ConfirmModalButton)`
  background: ${({ theme }) => theme.colors.buttonGreen};
`;

const mapDispatchToProps = dispatch => ({
  dispatchCloseModal: (modalType, modalProps) => dispatch(
    closeModal(modalType, modalProps)
  ),
});

export default connect(null, mapDispatchToProps)(ConfirmModal);
