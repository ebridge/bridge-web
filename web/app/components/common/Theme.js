import React from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {
  margins: {
    left: '20px',
    right: '20px',
    top: '10px',
    bottom: '10px',
  },
  padding: {
    leftAndRight: '20px',
    topAndBottom: '10px',
    left: '20px',
    right: '20px',
    top: '10px',
    bottom: '10px',
  },
  colors: {
    lightBlue: '#A7C8F2',
    blue: '#048ABF',
    mainGrey: '#5f5f5f',
    grey: '#5f5f5f',
    mainGray: '#5f5f5f',
    gray: '#5f5f5f',
    logoRed: '#cd0000',
    logoDarkRed: '#680007',
    lightGreen: '#027368',
    green: '#025951',
    buttonGreen: '#4bc970',
    buttonGreenDisabled: '#85c999',
    buttonGreenHover: '#51db7a',
    inputGrey: '#e8eeef',
    orange: '#F25116',
  },
  fonts: {
    quicksand: '\'Quicksand\', sans-serif',
  },
};

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;
