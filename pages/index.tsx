import Layout from "./_layout";
import { PrismaClient } from "@prisma/client";
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { GetStaticProps } from "next";
import Link from "next/link";
import { CardMedia, Typography, Card, CardContent, Button, Container, Box, Grid } from '@material-ui/core';

const prisma = new PrismaClient();
type Charity = {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
};

type HomePageProps = {
  charities: Charity[];
};

const HomePage = ({ charities }: HomePageProps) => {
  const { data: session } = useSession();
  return (
    <Layout>
      <Container>
        <Typography variant="h1" align="center" gutterBottom>Welcome to QALY.shop</Typography>
        <Typography variant="body1" align="justify" gutterBottom>
          At QALY.shop, we allow you to read up on the latest research and
          cost-effectiveness estimates and buy QALYs either directly or through
          gift cards.
        </Typography>
        <Typography variant="h2" align="center" gutterBottom>Charities</Typography>
        {charities.length === 0 && <Typography variant="body1" align="center" gutterBottom>We currently have no charities in the system</Typography>}
        <Grid container spacing={2}>
          {charities.map((charity: Charity) => (
            <Grid item xs={12} sm={6} md={4} key={charity.id}>
              <Link href={`/charities/${charity.id}`} passHref>
                <Card>
                  <CardMedia
                    component="img"
                    image={charity.logoUrl}
                    alt={`${charity.name} logo`}
                    title={charity.name}
                  />
                  <CardContent>
                    <Typography variant="h5">{charity.name}</Typography>
                    <Typography variant="body2">{charity.description}</Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
        {session && (
          <Box mt={4} display="flex" justifyContent="center">
            <Link href="/newcharity" passHref>
              <Button variant="contained" color="primary">Add Your Charity</Button>
            </Link>
          </Box>
        )}
      </Container>
    </Layout>
  )
};

export const getStaticProps: GetStaticProps = async () => {
  const charities = await prisma.charity.findMany({
    select: { id: true, name: true, logoUrl: true, description: true },
  });

  return { props: { charities } };
};

export default HomePage;
