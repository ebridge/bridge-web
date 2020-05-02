import styled from 'styled-components';
import Link from 'next/link';
import { breakpoints } from '../lib/styleUtils';

const Navbar = () => (
  <NavbarWrapper>
    <h1>Navbar</h1>
    {/* <NavbarLinksWrapper>
      <NavbarLink>
        <Link href='/login'>
          <a>Login</a>
        </Link>
      </NavbarLink>
      <NavbarLink>
        <Link href='/register'>
          <a>Sign up</a>
        </Link>
      </NavbarLink>
    </NavbarLinksWrapper> */}
  </NavbarWrapper>
);


const NavbarWrapper = styled.div`
  display: flex;
  width: 100vw;
  background: blue;
`;

const NavbarLinksWrapper = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavbarLink = styled.li`
  display: inline-block;
  margin-right: 10px;
`;

export default Navbar;
