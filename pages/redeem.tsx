import { FormEventHandler, useState } from "react";
import Layout from "./_layout";
import NotFound from "./404";
import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import { Box, Button, Container, FormControl, FormLabel, InputLabel, MenuItem, Select, TextField, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: theme.spacing(4),
  },
  donationForm: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  inputGroup: {
    flex: 1,
    '&:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  submitButton: {
    backgroundColor: '#0070f3',
    color: '#fff',
    marginTop: theme.spacing(2),
    '&[disabled]': {
      backgroundColor: '#ccc',
    },
  },
}));

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
  const classes = useStyles();

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
      <Container className={classes.container}>
        <Typography variant="h1">Redeem your gift card</Typography>
        <Typography>Gift Card Value: ${giftCard.value}</Typography>
        <form onSubmit={handleSubmit}>
          {donations.map((donation, index) => (
            <Box key={index} className={classes.donationForm}>
              <FormControl className={classes.inputGroup} variant="outlined">
                <InputLabel id={`charity-label-${index}`}>Charity</InputLabel>
                <Select
                  labelId={`charity-label-${index}`}
                  value={donation.charityId}
                  onChange={(e) => handleDonationIdChange(index, e.target.value as string)}
                  label="Charity"
                  required
                >
                  <MenuItem value="">
                    <em>--Select a charity--</em>
                  </MenuItem>
                  {charities.map((charity) => (
                    <MenuItem key={charity.id} value={charity.id}>
                      {charity.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.inputGroup}>
                <FormLabel>Amount</FormLabel>
                <TextField
                  type="number"
                  inputProps={{
                    min: "1",
                    max: giftCard.value - (totalDonation - donation.amount),
                  }}
                  value={donation.amount}
                  onChange={(e) =>
                    handleDonationAmountChange(index, e.target.value)
                  }
                  required
                />
              </FormControl>
            </Box>
          ))}
          {totalDonation < giftCard.value && (
            <Button variant="contained" color="primary" onClick={addDonation}>
              Add more donations
            </Button>
          )}
          <Button type="submit" disabled={totalDonation !== giftCard.value} className={classes.submitButton}>
            Submit
          </Button>
        </form>
        {isLoading && <CircularProgress />}
        {statusMessage && <Typography>{statusMessage}</Typography>}
      </Container>
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
