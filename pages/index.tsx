import Layout from "./_layout";
import Image from "next/image";
import { PrismaClient } from "@prisma/client";
import { GetStaticProps } from "next";
import Link from "next/link";

const prisma = new PrismaClient();
type Charity = {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
};

type HomePageProps = {
  charities: [];
};

const HomePage = ({ charities }: HomePageProps) => {
  return (
    <Layout>
      <h1 className="title">Welcome to QALY.shop</h1>
      <p>
        At QALY.shop, we allow you to read up on the latest research and
        cost-effectiveness estimates and buy QALYs either directly or through
        gift cards.
      </p>
      <h2 className="subtitle">Charities</h2>
      <ul className="charity-list">
        {charities.map((charity: Charity) => (
          <li key={charity.id} className="charity-item">
            <Link href={`/charity/${charity.id}`}>
              <a>
                <Image src={charity.logoUrl} alt={`${charity.name} logo`} />
                <h3>{charity.name}</h3>
                <p>{charity.description}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .title {
          text-align: center;
          margin-top: 20px;
        }

        .subtitle {
          text-align: center;
          margin-top: 10px;
        }

        .charity-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }

        .charity-item {
          margin: 10px;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        img {
          height: 100px;
          width: 100px;
          object-fit: cover;
        }
      `}</style>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const charities = await prisma.charity.findMany({
    select: { id: true, name: true, logoUrl: true, description: true },
  });

  return { props: { charities } };
};

export default HomePage;
