import styled from 'styled-components';
import { breakpoints } from '../../../lib/styleUtils';

export default styled.form`
  width: 85%;
  flex: 5;

  ${breakpoints.mobile} {
    width: 100%;
  }
`;
