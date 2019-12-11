import * as React from "react";
import Head from "next/head";
import Themed from "./Themed";
import MainNavbar from "./MainNavbar";

const LayoutMainContent = (props: any): React.ReactElement => {
  return <main className="hg-content">{props.children}</main>;
};

const LayoutNav = (props: any): React.ReactElement => {
  return <nav className="hg-nav">{props.children}</nav>;
};

const LayoutAside = (props: any): React.ReactElement => {
  return <aside className="hg-aside">{props.children}</aside>;
};

interface Props {
  children?: React.ReactNode[];
}

const Layout = (props: Props): React.ReactElement<any> => {
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
