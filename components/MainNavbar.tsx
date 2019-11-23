import * as React from "react";
import Link from "next/link";
import { Navbar, Button, Alignment } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

const MainNavbar = () => (
  <Navbar fixedToTop>
    <Navbar.Group align={Alignment.LEFT}>
      <Navbar.Heading>Trader Tools</Navbar.Heading>
    </Navbar.Group>
    <Navbar.Group align={Alignment.RIGHT}>
      <Button minimal icon={IconNames.HOME} text="Home" />
      <Button minimal icon={IconNames.DOCUMENT} text="Files" />
      <Navbar.Divider />
    </Navbar.Group>
  </Navbar>
);

export default MainNavbar;
