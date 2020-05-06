import styled from 'styled-components';
import { breakpoints } from '../../lib/styleUtils';

export default styled.div`
  background: ${props => props.theme.colors.lightGreen};

  display: flex;
  justify-content: center;
  width: 49%;
  padding: 3em;
  /* margin: 1em; */

  ${breakpoints.mobile} {
    width: 100vw;
  }
`;
