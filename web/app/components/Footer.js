import styled from 'styled-components';

const Footer = props => (
  <FooterWrapper height={props.height}>
    <span>&copy; Copyright Dirty E and the Boys 2020</span>
  </FooterWrapper>
);

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: ${props => props.height};
  font-family: ${props => props.theme.fonts.quicksand};
  background: ${props => props.theme.colors.blue};
  padding: ${props => `${props.theme.padding.topAndBottom} ${props.theme.padding.leftAndRight}`};
`;

export default Footer;
