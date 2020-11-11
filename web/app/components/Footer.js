import styled from 'styled-components';

const Footer = ({ height }) => (
  <StyledFooter height={height}>
    <span>&copy; Copyright Ethan Bonsignori 2020</span>
  </StyledFooter>
);

const StyledFooter = styled.footer`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: ${props => props.height || '5vh'};
  font-family: ${props => props.theme.fonts.quicksand};
  background: ${props => props.theme.colors.mainGrey};
  padding: ${props => `${props.theme.padding.topAndBottom} ${props.theme.padding.leftAndRight}`};
`;

export default Footer;
