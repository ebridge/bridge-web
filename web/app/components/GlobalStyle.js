import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Quicksand';
      src: url('/fonts/Quicksand-Bold.otf');
      src: url('/fonts/Quicksand-Bold-Italic.otf');
      src: url('/fonts/Quicksand-Italic.otf');
      src: url('/fonts/Quicksand-Light.otf');
      src: url('/fonts/Quicksand-Regular.otf');
  }
  body {
    margin: 0;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
