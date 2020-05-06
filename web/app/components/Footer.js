import styled from 'styled-components';

export default styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: ${props => props.height};
  font-family: ${props => props.theme.fonts.quicksand};
  background: ${props => props.theme.colors.blue};
  padding: ${props => `${props.theme.padding.topAndBottom} ${props.theme.padding.leftAndRight}`};
`;
