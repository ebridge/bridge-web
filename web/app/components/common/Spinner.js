import styled, { keyframes } from 'styled-components';

const spinner = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default styled.div`
  &::before {
    content: '';
    box-sizing: border-box;
    display: block;

    /* Size */
    height: ${props => props.height};
    width: ${props => props.width};

    /* Border */
    border-top: 2px solid ${props => props.theme.colors.logoRed};
    border-right: 2px solid transparent;
    border-radius: 50%;

    /* Animation */
    animation: ${spinner} 0.7s linear infinite;
  }
`;
