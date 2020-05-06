import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  openModal,
  closeModal,
} from '../redux/actions/modalActions';
import {
  LOGIN_MODAL,
  REGISTER_MODAL,
} from '../constants/modalConstants';

class Navbar extends React.Component {
  openLoginModal = () => {
    this.props.dispatchOpenModal(LOGIN_MODAL, { title: 'Login' });
  }

  openRegisterModal = () => {
    this.props.dispatchOpenModal(REGISTER_MODAL, { title: 'Register' });
  }

  render() {
    return (
      <NavbarWrapper height={this.props.height}>
        <NavbarTitle>eBridge</NavbarTitle>
        <NavbarLinksWrapper>
          <NavbarLink>
            <button onClick={this.openLoginModal}>Login</button>
          </NavbarLink>
          <NavbarLink>
            <button onClick={this.openRegisterModal}>Register</button>
          </NavbarLink>
        </NavbarLinksWrapper>
      </NavbarWrapper>
    );
  }
}

const NavbarWrapper = styled.div`
  display: flex;
  width: 100vw;
  min-height: ${props => props.height};
  background: ${props => props.theme.colors.blue};
  padding: ${props => `${props.theme.padding.topAndBottom} ${props.theme.padding.leftAndRight}`};
  justify-content: space-between;
`;

const NavbarTitle = styled.h1`
  font-family: ${props => props.theme.fonts.quicksand};
  font-weight: bold;
`;

const NavbarLinksWrapper = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavbarLink = styled.li`
  display: inline-block;
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
