import * as React from 'react';
import Head from 'next/head';
import Themed from './Themed';
import MainNavbar from './MainNavbar';

const LayoutMainContent = (props: React.PropsWithChildren<{}>): JSX.Element => {
  return <main className="hg-content">{props.children}</main>;
};

const LayoutNav = (props: React.PropsWithChildren<{}>): JSX.Element => {
  return <nav className="hg-nav">{props.children}</nav>;
};

const LayoutAside = (props: React.PropsWithChildren<{}>): JSX.Element => {
  return <aside className="hg-aside">{props.children}</aside>;
};

const Layout = (props: React.PropsWithChildren<{}>): JSX.Element => {
  return (
    <Themed>
      <Head>
        <link rel="icon" href="/favicon.ico" key="favicon" />
      </Head>
      <header>
        <MainNavbar />
      </header>
      <div className="app-body">{props.children}</div>
      <footer></footer>
    </Themed>
  );
};

Layout.Main = LayoutMainContent;
Layout.Nav = LayoutNav;
Layout.Aside = LayoutAside;

export default Layout;
