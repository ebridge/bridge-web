import { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import CloseRounded from '@material-ui/icons/CloseRounded';
import Logo from './common/Logo';
import LoginModal from './modals/LoginModal';
import RegisterModal from './modals/RegisterModal';
import ForgotModal from './modals/ForgotModal';
import { closeModal } from '../redux/actions/modalActions';

const MODAL_COMPONENTS = {
  LOGIN_MODAL: LoginModal,
  REGISTER_MODAL: RegisterModal,
  FORGOT_MODAL: ForgotModal,
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
    justifyContent: 'center',
    flexDirection: 'column',
    width: '35rem',
    height: '35rem',
    backgroundColor: '#fff',
    boxShadow: [0, 0, '0.625rem', 'rgba(0, 0, 0, 0.2)'],
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
        onRequestClose={dispatchCloseModal}
        style={modalStyles}
      >
        <CloseModalX title='Close' onClick={() => dispatchCloseModal()}>
          <CloseRounded />
        </CloseModalX>
        <LogoContainer>
          <Logo withBg/>
        </LogoContainer>
        <SpecificModal {...modalProps} />
      </ReactModal >
    );
  }
}

const LogoContainer = styled.div`
  position: absolute;
  top: 0;
`;

const CloseModalX = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;

  border: none;
  background: none;
  cursor: pointer;

  &:hover {
    color: #888
  }

  &:active {
    color: ${props => props.theme.colors.logoDarkRed}
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
