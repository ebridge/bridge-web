import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
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
import Logo from '../assets/images/logo.svg';
import { breakpoints } from '../lib/styleUtils';

class Navbar extends React.Component {
  openLoginModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(LOGIN_MODAL);
  }

  openRegisterModal = () => {
    const { dispatchOpenModal } = this.props;
    dispatchOpenModal(REGISTER_MODAL);
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
            <Link href={`/user/${displayName}`}>
              <button>{displayName}</button>
            </Link>
          </NavbarLink>
          <NavbarLink>
            <button onClick={this.logout}>Logout</button>
          </NavbarLink>
        </>
      );
    }
    // ♣
    return (
      <>
        <NavbarWrapper height={height || '8vh'}>
          <Link href='/'>
            <HomeButton>
              <Logo viewBox='-50 -50 500 500' width='50' height='50'/>
              Bridge Club
            </HomeButton>
          </Link>
          <NavbarLinksWrapper>
            {navbarLinks}
          </NavbarLinksWrapper>
        </NavbarWrapper>
      </>
    );
  }
}

const NavbarWrapper = styled.div`
  font-family: ${props => props.theme.fonts.quicksand};
  display: flex;
  flex-direction: row;
  min-width: 100vw;
  min-height: 100px;
  height: ${props => props.height};
  background: ${props => props.theme.colors.mainGrey};
  padding: ${props => `${props.theme.padding.topAndBottom} ${props.theme.padding.leftAndRight}`};
  justify-content: space-between;

  ${breakpoints.mobile} {
    flex-direction: column;
    align-items: center;
  }
`;

const HomeButton = styled.div`
  cursor: pointer;
  border: none;
  background: none;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #fff;
  font-size: 2em;

  ${breakpoints.mobile} {
    font-size: 1.5em;
  }
`;

const NavbarTitle = styled.h1`
  ;
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
