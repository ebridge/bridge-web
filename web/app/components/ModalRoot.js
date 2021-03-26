import { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import CloseRounded from '@material-ui/icons/CloseRounded';
import Logo from './common/Logo';
import LoginModal from './modals/LoginModal';
import RegisterModal from './modals/RegisterModal';
import ForgotPasswordModal from './modals/ForgotPasswordModal';
import EmailSentModal from './modals/EmailSentModal';
import CropModal from './modals/CropModal';
import ConfirmModal from './modals/ConfirmModal';
import StateModal from './modals/StateModal';
import { closeModal } from '../redux/actions/modalActions';

const MODAL_COMPONENTS = {
  LOGIN_MODAL: LoginModal,
  REGISTER_MODAL: RegisterModal,
  FORGOT_PASSWORD_MODAL: ForgotPasswordModal,
  EMAIL_SENT_MODAL: EmailSentModal,
  CROP_MODAL: CropModal,
  CONFIRM_MODAL: ConfirmModal,
  STATE_MODAL: StateModal,
};

// Bind modal to your appElement
ReactModal.setAppElement('#__next');

const modalStyles = {
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    zIndex: '9999',
    opacity: '1',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'baseline',
    flexDirection: 'column',
    width: '35rem',
    minHeight: '35rem',
    backgroundColor: '#fff',
    boxShadow: [0, 0, '0.625rem', 'rgba(0, 0, 0, 0.2)'],
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
};

class ModalRoot extends Component {
  render() {
    const {
      modalType,
      modalProps,
      dispatchCloseModal,
    } = this.props;

    if (!modalType) {
      return null;
    }

    const SpecificModal = MODAL_COMPONENTS[modalType];

    return (
      <ReactModal
        isOpen={modalType !== null}
        // onRequestClose={dispatchCloseModal}
        style={modalStyles}
      >
        <TopBar>
          <CloseButton title='Close' onClick={dispatchCloseModal}>
            <CloseRounded />
          </CloseButton>
          <Logo withBg size='70px'/>
        </TopBar>
        {/* <div style={{ minHeight: '100%' }}> */}
        <SpecificModal {...modalProps} />
        {/* </div>? */}
      </ReactModal >
    );
  }
}

const TopBar = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  border: none;
  background: none;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.logoDarkRed}
  }

  &:active {
    color: #000;
  }
`;

const mapStateToProps = (state = {}) => ({
  modalType: state?.modals?.modalType,
  modalProps: state?.modals?.modalProps,
});

const mapDispatchToProps = dispatch => ({
  dispatchCloseModal: (modalType, modalProps) => dispatch(
    closeModal(modalType, modalProps)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot);
