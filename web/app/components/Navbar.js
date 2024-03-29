import { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { openModal } from '../redux/actions/modalActions';
import { userLogout } from '../redux/actions/userActions';
import {
  LOGIN_MODAL,
  REGISTER_MODAL,
} from '../constants/modalConstants';
import { breakpoints } from '../lib/styleUtils';
import Logo from '../assets/images/logo.svg';

const Navbar = ({
  dispatchOpenModal,
  dispatchUserLogout,
  displayName,
  profile,
}) => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const navMenuRef = useRef(null);

  const openLoginModal = () => {
    dispatchOpenModal(LOGIN_MODAL);
  };

  const openRegisterModal = () => {
    dispatchOpenModal(REGISTER_MODAL);
  };

  const toggleNavMenu = () => {
    setIsNavMenuOpen(!isNavMenuOpen);
  };

  const handleOutsideClick = event => {
    if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
      setIsNavMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  let navbarLinks = (
    <>
      <NavbarLink>
        <NavButton onClick={openLoginModal}>Login</NavButton>
      </NavbarLink>
      <NavbarLink>
        <NavButton onClick={openRegisterModal}>Register</NavButton>
      </NavbarLink>
    </>
  );

  if (displayName) {
    navbarLinks = (
      <>
        <NavMenuContainer ref={navMenuRef}>
          <NavMenuToggle onClick={toggleNavMenu}>
            <Avatar src={profile?.profilePictureUrl ? profile?.profilePictureUrl : 'https://placehold.it/200x200'} alt={displayName} />
            <ArrowDropDownIcon />
          </NavMenuToggle>
          <NavMenu isOpen={isNavMenuOpen}>
            <NavDisplayName>Signed in as<br /><b>{displayName}</b></NavDisplayName>
            <NavMenuWrapper>
              <Link href='/user/profile' passHref>
                <NavMenuLink onClick={toggleNavMenu}>My profile</NavMenuLink>
              </Link>
              <NavMenuLink onClick={dispatchUserLogout}>Logout</NavMenuLink>
            </NavMenuWrapper>
          </NavMenu>
        </NavMenuContainer>
      </>
    );
  }
  // ♣
  return (
    <>
      <NavbarWrapper>
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
};


const NavbarWrapper = styled.div`
  font-family: ${props => props.theme.fonts.quicksand};
  display: flex;
  flex-direction: row;
  min-width: 100vw;
  background: ${props => props.theme.colors.mainGrey};
  padding: ${props => `${props.theme.padding.topAndBottom} ${props.theme.padding.leftAndRight}`};
  justify-content: space-between;

  ${breakpoints.mobile} {
    align-items: center;
    padding: 0.3em;
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
  font-size: 1.6em;

  ${breakpoints.mobile} {
    font-size: 1.5em;
  }
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

const NavButton = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  background: none;

  font-family: ${({ theme }) => theme.fonts.quicksand};
  padding: 1em;
  font-size: 1em;
  color: #fff;
  
  &:hover {
    text-decoration: underline;
  }

  ${breakpoints.mobile} {
    padding: 0.5em;
  }
`;

const NavMenuContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const NavMenuToggle = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  background: none;
  color: #fff;

  display: flex;
  align-items: center;

  &:hover {
    color: #999;
  }
`;

const NavMenu = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;

  position: absolute;
  right: 0;
  border: 1px solid grey;
  border-radius: 6px;
  background: #fff;
  width: 180px;
`;

const NavDisplayName = styled.div`
  padding: 10px 20px;
  border-bottom: 1px solid grey;
`;

const NavMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px 0;
`;

const NavMenuLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: #000;
  width: 100%;
  padding: 8px 20px;

  display: flex;
  align-items: center;

  &:hover {
    background: #e2e2e2;
  }

  &:active {
    background: #c1c1c1;
  }
`;

const mapDispatchToProps = dispatch => ({
  dispatchOpenModal: (modalType, modalProps) => dispatch(
    openModal(modalType, modalProps)
  ),
  dispatchUserLogout: () => dispatch(userLogout()),
});

export default connect(null, mapDispatchToProps)(Navbar);
