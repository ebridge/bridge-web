import styled from 'styled-components';
import { breakpoints } from '../../lib/styleUtils';

export default styled.div`
  background: yellow;

  display: flex;
  justify-content: center;
  width: 38vw;
  padding: 3em;
  /* margin: 1em; */

  ${breakpoints.mobile} {
    width: 100vw;
  }
`;
