/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { ThemeProvider } from "emotion-theming";
import theme from "../themes/light";
import "../scss/styles.scss";

export default (props: { children: any }) => <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
