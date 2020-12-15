import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100vw;
  }
  body {
    margin: 0;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  textarea, input, select {
    font-family: sans-serif;
  }

  .react-datepicker__input-container input {
    color: #384047;
    background-color: #e8eeef;
    box-shadow: 0px 1px 1px rgba(0,0,0,0.03) inset;
    border-radius: 4px;
    width: 100%;
    padding: 1em;
    border: 1px solid black;
  }
  .react-datepicker-popper {
    z-index: 9999 !important;
  }
`;

export default GlobalStyle;
