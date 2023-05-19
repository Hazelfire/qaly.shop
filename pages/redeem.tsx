import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import NotFound from "./404";
import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";

// Initialize Prisma client
const prisma = new PrismaClient();

type Charity = {
  id: string;
  name: string;
};

type Donation = {
  charityId: string;
  amount: number;
};

type RedeemPageProps = {
  giftCardValue: number;
  charities: Charity[];
  notFound: boolean;
};

const RedeemPage: React.FC<RedeemPageProps> = ({
  giftCardValue,
  charities,
  notFound,
}) => {
  const [donations, setDonations] = useState<Donation[]>([
    { charityId: "", amount: 0 },
  ]);

  const handleDonationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newDonations = [...donations];
    newDonations[index][field] = value;
    setDonations(newDonations);
  };

  const addDonation = () => {
    setDonations([...donations, { charityId: "", amount: 0 }]);
  };

  const totalDonation = donations.reduce(
    (acc, donation) => acc + Number(donation.amount),
    0
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Submit this form to your API for processing
    console.log(donations);
  };

  if (notFound) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div>
        <h1>Redeem your gift card</h1>
        <p>Gift Card Value: ${giftCardValue}</p>
        <form onSubmit={handleSubmit}>
          {donations.map((donation, index) => (
            <div key={index}>
              <label>Charity:</label>
              <select
                value={donation.charityId}
                onChange={(e) =>
                  handleDonationChange(index, "charityId", e.target.value)
                }
                required
              >
                <option value="">--Select a charity--</option>
                {charities.map((charity) => (
                  <option key={charity.id} value={charity.id}>
                    {charity.name}
                  </option>
                ))}
              </select>

              <label>Amount:</label>
              <input
                type="number"
                min="1"
                max={giftCardValue - totalDonation}
                value={donation.amount}
                onChange={(e) =>
                  handleDonationChange(index, "amount", e.target.value)
                }
                required
              />
            </div>
          ))}
          {totalDonation < giftCardValue && (
            <button type="button" onClick={addDonation}>
              Add more donations
            </button>
          )}
          <button type="submit" disabled={totalDonation !== giftCardValue}>
            Submit
          </button>
        </form>
        <style jsx>{`
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            font-family: Arial, sans-serif;
          }

          .donation-form {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
          }

          .input-group {
            flex: 1;
          }

          .input-group:not(:last-child) {
            margin-right: 1rem;
          }

          select,
          input {
            width: 100%;
            padding: 0.5rem;
            font-size: 1rem;
          }

          button {
            background-color: #0070f3;
            color: white;
            border: none;
            padding: 1rem 2rem;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
          }

          button[disabled] {
            background-color: #ccc;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { giftCardId } = context.query;

  // Fetch gift card total from Prisma
  const giftCard = await prisma.giftCard.findUnique({
    where: { id: Number(giftCardId) },
  });

  // Fetch charities from Prisma
  const charities = await prisma.charity.findMany();

  // Be sure to handle cases where the gift card or charities might not be found.
  // For example, if (!giftCard) return { notFound: true }

  return {
    props: {
      notFound: !giftCard,
      giftCardValue: giftCard?.total || 0,
      charities: charities,
    },
  };
};

export default RedeemPage;
