import App from 'next/app';
import React from 'react';
// import { Provider } from 'react-redux';
import wrapper from '../redux/store';
import GlobalStyle from '../components/GlobalStyle';
import Theme from '../components/common/Theme';
import ModalRoot from '../components/ModalRoot';
import { getRequest } from '../redux/service';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const response = await getRequest('/users/authenticate', {}, { req: ctx.req });

    return {
      id: response?.id,
      displayName: response?.displayName,
      pageProps: {
        store: ctx.store,
        ...(Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}
        ),
      },
    };
  }

  render() {
    // pageProps that were returned from 'getInitialProps' are stored in the props
    const {
      Component,
      pageProps,
      id,
      displayName,
    } = this.props;

    return (
      <>
        <GlobalStyle />
        <Theme>
          <Component
            {...pageProps}
            userId={id}
            displayName={displayName}
          />
          <ModalRoot />
        </Theme>
      </>
    );
  }
}

// withRedux wrapper that passes the store to the App Component
export default wrapper.withRedux(MyApp);
