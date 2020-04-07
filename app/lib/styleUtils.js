const calcSize = (fontSize) => `calc( ${fontSize}px + (24 - 16) * (100vw - 400px) / (800 - 400) ); }`;
const calcSizeMobile = (fontSize) => `calc( ${fontSize}px + (24 - 16) * (100vw - 400px) / (800 - 400) ); }`;

export const size = {
  mobile: '350px',
  mobileLg: '500px',
  tablet: '768px',
  desktop: '1920px',
  desktopLg: '2560px',
};

export const breakpoints = {
  mobile: `@media (max-width: ${size.tablet}) and (min-width: 1px)`,
  mobileLg: `@media (max-width: ${size.tablet}) and (min-width: ${size.mobileLg})`,
  desktop: `@media (max-width: ${size.desktop}) and (min-width: ${size.tablet})`,
  desktopLg: `@media (min-width: ${size.desktopLg})`,
};

export const fontStyle = (
  fontSize,
  fontFamily,
  lineHeight,
  letterSpacing,
  textTransform
) => `
  font-size: ${fontSize};
  font-family: ${fontFamily};

  text-transform: ${textTransform};
  text-decoration: none;
  ${breakpoints.mobile} {
    font-size: ${calcSizeMobile(fontSize)};

  }
  `;

// line-height: ${lineHeight ? calcSize(lineHeight) : calcSize(fontSize)};
// letter-spacing: ${calcSize(letterSpacing)};

// line-height: ${lineHeight ? calcSizeMobile(lineHeight) : calcSizeMobile(fontSize)};
// letter-spacing: ${calcSizeMobile(letterSpacing)};
