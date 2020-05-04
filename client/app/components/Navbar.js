import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { connect } from 'react-redux';
import { breakpoints } from '../lib/styleUtils';
import ModalRoot from './ModalRoot'
import {
  openModal,
  closeModal
} from '../redux/actions/modalActions';
import {
  LOGIN_MODAL,
  REGISTER_MODAL
} from '../constants/modalConstants'

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.openLoginModal = this.openLoginModal.bind(this);
    this.openRegisterModal = this.openRegisterModal.bind(this);
  }

  openLoginModal() {
    this.props.dispatchOpenModal(LOGIN_MODAL, { title: 'Login' })
  }

  openRegisterModal() {
    this.props.dispatchOpenModal(REGISTER_MODAL, { title: 'Register' })
  }

  render() {
    return (
      <NavbarWrapper>
        <NavbarLinksWrapper>
          <NavbarLink>
            <button onClick={this.openLoginModal}>Login</button>
          </NavbarLink>
          <NavbarLink>
            <button onClick={this.openRegisterModal}>Register</button>
          </NavbarLink>
        </NavbarLinksWrapper>
      </NavbarWrapper>
    )
  };
};

const NavbarWrapper = styled.div`
  display: flex;
  width: 100vw;
  background: white;
  border: 1px solid black;
  justify-content: flex-end;
`;

const NavbarLinksWrapper = styled.ul`
  list-style: none;
  padding: 1rem;
  margin: 0;
`;

const NavbarLink = styled.li`
  display: inline-block;
  margin-right: 10px;
`;

const mapDispatchToProps = dispatch => ({
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
  dispatchCloseModal: (modalType, modalProps) => dispatch(
    closeModal(modalType, modalProps)
  ),
});

export default connect(() => ({}), mapDispatchToProps)(Navbar);
