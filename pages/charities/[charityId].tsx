import { GetServerSideProps } from 'next';
import { PrismaClient } from '@prisma/client';
import { Button, Box, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../_layout';
import { useSession } from "next-auth/react"
import Link from 'next/link';

const prisma = new PrismaClient();

const useStyles = makeStyles((theme) => ({
  charityContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: theme.spacing(3),
  },
  charityLogo: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
  },
  charityDescription: {
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: theme.spacing(2),
  },
  charityLinks: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

type Charity = {
  id: number;
  name: string;
  description: string;
  homepageLink: string;
  logoUrl: string;
  donateUrl: string;
};

type CharityPageProps = {
  charity: Charity;
};

const CharityPage: React.FC<CharityPageProps> = ({ charity }) => {
  const classes = useStyles();
  const { data: session } = useSession();

  return (
    <Layout>
      <Container className={classes.charityContainer}>
        <Typography variant="h1">{charity.name}</Typography>
        <img className={classes.charityLogo} src={charity.logoUrl} alt={`${charity.name} logo`} />
        <Typography className={classes.charityDescription}>{charity.description}</Typography>
        <Box className={classes.charityLinks}>
          <Button variant="contained" color="primary" href={charity.donateUrl}>Donate</Button>
          <Button variant="contained" color="primary" href={charity.homepageLink}>Homepage</Button>
          {session && (
            <Link href={`/charities/${charity.id}/edit`} passHref>
              <Button variant="contained" color="primary">Edit</Button>
            </Link>
          )}
        </Box>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { charityId } = context.params;

  const charity = await prisma.charity.findUnique({
    where: { id: Number(charityId) },
  });

  if (!charity) {
    return { notFound: true };
  }

  return {
    props: { charity },
  };
};

export default CharityPage;
