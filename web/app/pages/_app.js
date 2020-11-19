import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import wrapper from '../redux/store';
import GlobalStyle from '../components/GlobalStyle';
import Theme from '../components/common/Theme';
import ModalRoot from '../components/ModalRoot';
import { getRequest } from '../redux/service';
import checkUserPermsAndRoute from '../lib/roleRedirects';

class MyApp extends App {
  componentDidMount() {
    const { role, emailConfirmed } = this.props;
    Router.events.on('routeChangeStart', () => {
      checkUserPermsAndRoute(null, Router.pathname, role, emailConfirmed);
    });
  }

  static async getInitialProps({ Component, ctx }) {
    const response = await getRequest('/users/authenticate', {}, { req: ctx.req });

    checkUserPermsAndRoute(ctx?.res, ctx?.pathname, response?.role, response?.emailConfirmed);

    return {
      id: response?.id,
      role: response?.role,
      displayName: response?.displayName,
      emailConfirmed: response?.emailConfirmed,
      pathname: ctx?.pathname,
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
      role,
      displayName,
      emailConfirmed,
    } = this.props;

    return (
      <>
        <Head>
          <link rel='shortcut icon' href='/favicon.ico' />
          <title>eBridge Club - Free Online Contract Bridge</title>
          <style>{'#__next { height: 100% }'}</style>
        </Head>
        <GlobalStyle />
        <Theme>
          <Component
            {...pageProps}
            userId={id}
            role={role}
            displayName={displayName}
            emailConfirmed={emailConfirmed}
          />
          <ModalRoot />
        </Theme>
      </>
    );
  }
}

// withRedux wrapper that passes the store to the App Component
export default wrapper.withRedux(MyApp);
