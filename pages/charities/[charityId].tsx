// pages/charities/[charityId].tsx
import { GetServerSideProps } from 'next';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import Layout from '../_layout';

const prisma = new PrismaClient();

type Charity = {
  id: number;
  name: string;
  description: string;
  homepageLink: string;
  logoLink: string;
  donateLink: string;
};

type CharityPageProps = {
  charity: Charity;
};

const CharityPage: React.FC<CharityPageProps> = ({ charity }) => (
  <Layout>
    <h1>{charity.name}</h1>
    <img src={charity.logoLink} alt={`${charity.name} logo`} />
    <p>{charity.description}</p>
    <Link href={charity.donateLink}>
      <a>Donate</a>
    </Link>
    <Link href={charity.homepageLink}>
      <a>Homepage</a>
    </Link>
    {/* Add charity evaluations section here */}
  </Layout>
);

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
