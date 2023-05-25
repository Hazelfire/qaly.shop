import Link from "next/link";
import React, { ReactNode } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';
import { AppBar, Toolbar, Button, Container, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  navLink: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.contrastText,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.light,
    }
  },
  authButton: {
    marginLeft: 'auto',
  },
  container: {
    marginBottom: theme.spacing(8),
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.palette.background.default,
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  footerLink: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.dark,
    }
  }
}));

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" passHref>
            <Button component="a" className={classes.navLink}>Home</Button>
          </Link>
          <Link href="/gift_cards" passHref>
            <Button component="a" className={classes.navLink}>Buy a Gift Card</Button>
          </Link>
          {!session && (
            <Button onClick={() => signIn()} className={`${classes.navLink} ${classes.authButton}`}>
              Sign In
            </Button>
          )}
          {session && (
            <Button onClick={() => signOut()} className={`${classes.navLink} ${classes.authButton}`}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
    <Container className={classes.container}>
      <Box mt={2}>{children}</Box>
    </Container>
      <footer className={classes.footer}>
        <Link href="/tos" passHref>
          <Button component="a" className={classes.footerLink}>Terms of Service</Button>
        </Link>
        <Link href="/privacy" passHref>
          <Button component="a" className={classes.footerLink}>Privacy Policy</Button>
        </Link>
        <Link href="mailto:samnolan555@gmail.com" passHref>
          <Button component="a" className={classes.footerLink}>Contact Us</Button>
        </Link>
      </footer>
    </div>
  );
};

export default Layout;
