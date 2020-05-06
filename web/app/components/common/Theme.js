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
    leftAndRight: '40px',
    topAndBottom: '5px',
    left: '20px',
    right: '20px',
    top: '10px',
    bottom: '10px',
  },
  colors: {
    lightBlue: '#A7C8F2',
    blue: '#048ABF',
    lightGreen: '#027368',
    green: '#025951',
    orange: '#F25116',
  },
  fonts: {
    quicksand: 'Quicksand',
  },
};

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;
