import styled, { keyframes } from 'styled-components';
import { breakpoints } from '../../lib/styleUtils';

const LandingLayout = ({ children }) => () => (
  <PageWrapper>
    <ContentWrapper>
      <BackgroundImage />
      {children}
    </ContentWrapper>
  </PageWrapper>
);

const gradientFlow = keyframes`
  0% { background-position:0% 52% }
  50% { background-position:100% 49% }
  100% { background-position:0% 52% }
`;

const borderWidth = '20px';
const borderWidthMobile = '10px';

const PageWrapper = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  max-width: 100vw;
  max-height: 100vh;

  position: absolute;
  background: #000;
  background-clip: padding-box;
  border: solid ${borderWidth} transparent;
  
  &:before {
    content: '';
    position: absolute;
    top: 0; right: 0;  bottom: 0; left: 0;
    z-index: -1;
    margin: -${borderWidth};
    background: linear-gradient(60deg, #ff0000, #ffb600, #ff0000);
    background-size: 600%, 600%;
    animation: ${gradientFlow} 10s ease infinite;

    ${breakpoints.mobile} {
      margin: -${borderWidthMobile}
    }
  }

  ${breakpoints.mobile} {
    border-width: ${borderWidthMobile}
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;

  position: absolute;
  top: 0; right: 0; left: 0; bottom: 0;
  z-index: 10;
`;

const BackgroundImage = styled.div`
  position: absolute;
  background-image: url('/images/cards-table.jpg');
  background-size: cover;
  background-position: center;
  top: 0; right: 0; left: 0; bottom: 0;
  width: 100%;
  height: 100%;
  mask-image: linear-gradient(rgba(0, 0, 0, 1.0), rgba(0, 0, 0, 0.2));
  z-index: -2;
`;

export default LandingLayout;
