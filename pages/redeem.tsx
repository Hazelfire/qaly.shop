import { FormEventHandler, useState } from "react";
import Layout from "./_layout";
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
  giftCard: { id: string; value: number };
  charities: Charity[];
  notFound: boolean;
};

const RedeemPage: React.FC<RedeemPageProps> = ({
  giftCard,
  charities,
  notFound,
}) => {
  const [donations, setDonations] = useState<Donation[]>([
    {
      charityId: "",
      amount: 0,
    },
  ]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDonationAmountChange = (index: number, value: string) => {
    const newDonations = [...donations];
    newDonations[index].amount = Number(value);
    setDonations(newDonations);
  };

  const handleDonationIdChange = (index: number, value: string) => {
    const newDonations = [...donations];
    newDonations[index].charityId = value;
    setDonations(newDonations);
  };

  const addDonation = () => {
    setDonations([...donations, { charityId: "", amount: 0 }]);
  };

  const totalDonation = donations.reduce(
    (acc, donation) => acc + Number(donation.amount),
    0
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_card_id: giftCard.id,
          charities: donations.map(({ charityId, amount }) => ({
            id: Number(charityId),
            amount,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage("Gift card has been successfully redeemed");
      } else {
        setStatusMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("An unexpected error occurred");
    }

    setIsLoading(false);
  };

  if (notFound) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div>
        <h1>Redeem your gift card</h1>
        <p>Gift Card Value: ${giftCard.value}</p>
        <form onSubmit={handleSubmit}>
          {donations.map((donation, index) => (
            <div key={index}>
              <label>Charity:</label>
              <select
                value={donation.charityId}
                onChange={(e) => handleDonationIdChange(index, e.target.value)}
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
                max={giftCard.value - (totalDonation - donation.amount)}
                value={donation.amount}
                onChange={(e) =>
                  handleDonationAmountChange(index, e.target.value)
                }
                required
              />
            </div>
          ))}
          {totalDonation < giftCard.value && (
            <button type="button" onClick={addDonation}>
              Add more donations
            </button>
          )}
          <button type="submit" disabled={totalDonation !== giftCard.value}>
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
      {isLoading && <div>Loading...</div>}
      {statusMessage && <div>{statusMessage}</div>}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { giftCardId } = context.query;

  // If it's an array (multiple entries in query string) choose first one
  if (typeof giftCardId === "object") {
    giftCardId = giftCardId[0];
  }
  // Fetch gift card total from Prisma
  const giftCard = await prisma.giftCard.findUnique({
    where: { id: giftCardId },
  });

  // Fetch charities from Prisma
  const charities = await prisma.charity.findMany();

  // Be sure to handle cases where the gift card or charities might not be found.
  // For example, if (!giftCard) return { notFound: true }

  return {
    props: {
      notFound: !giftCard,
      giftCard: {
        id: giftCardId,
        value: giftCard?.total.toNumber() || 0,
      },
      charities: charities,
    },
  };
};

export default RedeemPage;
