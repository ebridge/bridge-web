import { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Quicksand';
      src: url('/fonts/Quicksand-Bold.ttf');
      src: url('/fonts/Quicksand-Light.ttf');
      src: url('/fonts/Quicksand-Medium.ttf');
      src: url('/fonts/Quicksand-Regular.ttf');
      src: url('/fonts/Quicksand-SemiBold.ttf');
  }
  body {
    margin: 0;
    font-family: 'Quicksand';
    text-rendering: optimizeLegibility;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

const MyApp = ({ Component, pageProps }) => (
  <>
    <GlobalStyle />
    <Component {...pageProps} />
  </>
);

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};
export default MyApp;
