import React from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"
import { ThemeProvider, createTheme } from "@material-ui/core"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import CssBaseline from '@material-ui/core/CssBaseline';
import DateFnsUtils from '@date-io/date-fns';

export const theme = createTheme({
  palette: {
    primary: {
      light: '#3e7cb3', // Light blue
      main: '#033e8b', // Dark blue
      dark: '#00235b', // Even darker blue for contrast
      contrastText: '#fff', // White for text
    },
    secondary: {
      light: '#f0f4f7', // Lighter grey for backgrounds
      main: '#dee2e6', // Medium grey
      dark: '#495057', // Dark grey for contrast
      contrastText: '#000', // Black for text
    },
  },
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return <ThemeProvider theme={theme}>
    <SessionProvider session={session}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />
        <Component {...pageProps} />
      </MuiPickersUtilsProvider>
    </SessionProvider>
  </ThemeProvider>
}