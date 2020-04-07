import styled from 'styled-components';
import Link from 'next/link';
import { breakpoints } from '../lib/styleUtils';

const NavbarContainer = styled.div`
  width: 100vw;
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    display: inline;
    margin-right: 10px;
  }

  ${breakpoints.mobile} {
    /* width: 100px; */
  }
`;

const Navbar = () => (
  <NavbarContainer>
    <ul>
      <li>
        <Link href='/landing'>
          <a>Landing</a>
        </Link>
      </li>
      <li>
        <Link href='/login'>
          <a>Login</a>
        </Link>
      </li>
      <li>
        <Link href='/register'>
          <a>Sign up</a>
        </Link>
      </li>
    </ul>
  </NavbarContainer>
);

export default Navbar;
