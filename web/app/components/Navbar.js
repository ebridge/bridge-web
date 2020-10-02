import React from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  openModal,
  closeModal,
} from '../redux/actions/modalActions';
import { userLogout } from '../redux/actions/userActions';
import {
  LOGIN_MODAL,
  REGISTER_MODAL,
} from '../constants/modalConstants';

class Navbar extends React.Component {
  openLoginModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(LOGIN_MODAL);
  }

  openRegisterModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(REGISTER_MODAL);
  }

  openProfilePage = () => {
    const { displayName } = this.props;
    Router.push(`/user/${displayName}`);
  }

  logout = () => {
    const { dispatchUserLogout } = this.props;
    dispatchUserLogout();
  }

  render() {
    const {
      height,
      displayName,
    } = this.props;
    let navbarLinks = (
      <>
        <NavbarLink>
          <button onClick={this.openLoginModal}>Login</button>
        </NavbarLink>
        <NavbarLink>
          <button onClick={this.openRegisterModal}>Register</button>
        </NavbarLink>
      </>
    );
    if (displayName) {
      navbarLinks = (
        <>
          <NavbarLink>
            <button onClick={this.openProfilePage}>{displayName}</button>
          </NavbarLink>
          <NavbarLink>
            <button onClick={this.logout}>Logout</button>
          </NavbarLink>
        </>
      );
    }

    return (
      <NavbarWrapper height={height}>
        <NavbarTitle>eBridge</NavbarTitle>
        <NavbarLinksWrapper>
          {navbarLinks}
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
  dispatchUserLogout: () => dispatch(userLogout()),
});

export default connect(() => ({}), mapDispatchToProps)(Navbar);
