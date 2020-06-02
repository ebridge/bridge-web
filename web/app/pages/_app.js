import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import makeStore from '../redux/store';
import GlobalStyle from '../components/GlobalStyle';
import Theme from '../components/common/Theme';
import ModalRoot from '../components/ModalRoot';


class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    return {
      pageProps: {
        ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
      },
    };
  }

  render() {
    // pageProps that were returned  from 'getInitialProps' are stored in the props
    const { Component, pageProps, store } = this.props;

    return (
      <Provider store={store}>
        <GlobalStyle />
        <Theme>
          <Component {...pageProps} />
          <ModalRoot />
        </Theme>
      </Provider>
    );
  }
}

// withRedux wrapper that passes the store to the App Component
export default withRedux(makeStore, { debug: false })(MyApp);
