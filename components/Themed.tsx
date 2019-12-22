/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { ThemeProvider } from 'emotion-theming';
import theme from '../themes/light';
import '../scss/styles.scss';

const Themed = (props: React.PropsWithChildren<{}>): JSX.Element => (
  <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
);

export default Themed;
