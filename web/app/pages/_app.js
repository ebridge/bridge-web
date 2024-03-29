import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import wrapper from '../redux/store';
import GlobalStyle from '../components/GlobalStyle';
import Theme from '../components/common/Theme';
import ModalRoot from '../components/ModalRoot';
import { getRequest } from '../redux/service';
import checkUserPermsAndRoute from '../lib/roleRedirects';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const response = await getRequest('/users/authenticate', {}, { req: ctx.req });

    checkUserPermsAndRoute(ctx?.res, ctx?.pathname, response?.role, response?.emailConfirmed);

    return {
      id: response?.id,
      role: response?.role,
      displayName: response?.displayName,
      emailConfirmed: response?.emailConfirmed,
      profile: response?.profile,
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
      profile,
    } = this.props;
    return (
      <>
        <Head>
          {/* Import Google fonts - better than self-hosting w/Next.js per https://github.com/rohanray/next-fonts/issues/34#issuecomment-660235508 */}
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;500;700&display=swap" rel="stylesheet"/>
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
            profile={profile}
          />
          <ModalRoot />
        </Theme>
      </>
    );
  }
}

// withRedux wrapper that passes the store to the App Component
export default wrapper.withRedux(MyApp);
