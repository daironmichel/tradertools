import * as React from "react";
import Head from "next/head";
import Themed from "./Themed";
import MainNavbar from "./MainNavbar";

interface Props {
  children?: React.ReactNode[];
}

export default (props: Props): React.ReactElement<any> => {
  return (
    <Themed>
      <Head>
        <link rel="icon" href="/favicon.ico" key="favicon" />
      </Head>
      <div className="app-layout">
        <MainNavbar />
        {props.children}
      </div>
    </Themed>
  );
};
