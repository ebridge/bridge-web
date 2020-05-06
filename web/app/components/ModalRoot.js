import { connect } from 'react-redux'
import ReactModal from 'react-modal';
import LoginModal from './modals/LoginModal';
import RegisterModal from './modals/RegisterModal';
import ForgotModal from './modals/ForgotModal';
import { closeModal } from '../redux/actions/modalActions';

const MODAL_COMPONENTS = {
  LOGIN_MODAL: LoginModal,
  REGISTER_MODAL: RegisterModal,
  FORGOT_MODAL: ForgotModal,
}

// Bind modal to your appElement
ReactModal.setAppElement('#__next');

class ModalRoot extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      modalType,
      modalProps,
      dispatchCloseModal
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
        <SpecificModal {...modalProps} />
      </ReactModal >
    )
  };
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  },
  content: {
    position: 'absolute',
    top: '25vh',
    left: '33%',
    right: '33%',
    bottom: '25vh',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '50px 200px'
  }
}

const mapStateToProps = (state = fromJS({})) => {
  const modals = state.get('modals');
  return {
    modalType: modals.get('modalType'),
    modalProps: modals.get('modalProps'),
  };
}

const mapDispatchToProps = dispatch => ({
  dispatchCloseModal: (modalType, modalProps) => dispatch(
    closeModal(modalType, modalProps)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot);
