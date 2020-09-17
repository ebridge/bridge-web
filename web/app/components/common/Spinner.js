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
    margin-top: ${props => `calc(${props.height} / -2)`};
    margin-left: ${props => `calc(${props.width} / -2)`};

    /* Border */
    border-top: 2px solid ${props => props.theme.colors.orange};
    border-right: 2px solid transparent;
    border-radius: 50%;

    /* Animation */
    animation: ${spinner} 0.7s linear infinite;
  }
`;
