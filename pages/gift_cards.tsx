import React, { useState, useEffect, ChangeEvent } from "react";
import Layout from "./_layout";
import StripeCheckout from "react-stripe-checkout";
import { Form, FormInput, FormNumber, FormSelect, FormTextarea } from 'components/Form'
import { Typography, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Grid } from '@material-ui/core';
import { DatePicker } from "@material-ui/pickers";
import Image from 'next/image'

const GiftCardPage: React.FC<{}> = () => {
  const [total, setTotal] = useState(0);
  const [stripeFees, setStripeFees] = useState(0);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [receiveDate, setReceiveDate] = useState<Date | null>(null);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState<
    boolean | null
  >(null);
  const [selectedDesign, setSelectedDesign] = useState("");
  const [purchaserName, setPurchaserName] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    // Calculate Stripe's processing fees
    setStripeFees(total * 0.029 + 0.3);
  }, [total]);

  const handleTotalChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTotal(Number(event.target.value));
  };

  const handleRecipientEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRecipientEmail(event.target.value);
  };

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

  const handleReceiveDateChange = (date: Date | null) => {
    setReceiveDate(date);
  };

  const onToken = async (token: { id: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          purchaserName: purchaserName,
          message: customMessage,
          purchaserEmail: purchaserEmail,
          recipientName: recipientName,
          recipientEmail: recipientEmail,
          recieveDate: receiveDate,
          giftCardValue: total,
          currency: currency,
          stripeToken: token.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsTransactionSuccess(true);
        setTransactionStatus("Transaction was successful!");
      } else {
        setIsTransactionSuccess(false);
        setTransactionStatus(`Transaction failed: ${data.error}`);
      }
    } catch (error) {
      setIsTransactionSuccess(false);
      setTransactionStatus(`Transaction failed`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Layout>
      <Form
        title="Buy Gift Card"
        error={transactionStatus}
        success={isTransactionSuccess === true}
        submitting={isLoading}
        successMessage="Gift card purchased successfully"
        includeButton={false}
      >
        <FormInput
          value={purchaserName}
          onChange={(e) => setPurchaserName(e.target.value)}
          label="Name"
          placeholder="Your name"
        />

        <FormInput
          value={purchaserEmail}
          onChange={(e) => setPurchaserEmail(e.target.value)}
          label="Email"
          placeholder="Your email"
        />

        <FormInput
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          label="Recipient name"
          placeholder="Recipient name"
        />

        <FormInput
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          label="Recipient email"
          placeholder="Recipient email"
        />

        <DatePicker
          clearable={true}
          label="Receive Date"
          value={receiveDate}
          onChange={handleReceiveDateChange}
          format="dd/MM/yyyy"
          inputVariant="outlined"
          fullWidth
        />

        <FormSelect
          value={currency}
          onChange={handleCurrencyChange}
          label="Select currency"
          options={[
            { value: 'USD', label: 'USD' },
            { value: 'EUR', label: 'EUR' },
            { value: 'AUD', label: 'AUD' },
            // Add more options as needed
          ]}
        />

        <FormTextarea
          value={customMessage}
          label="Your Message"
          onChange={(e) => setCustomMessage(e.target.value)}
        />

        <FormNumber
          value={total}
          label="Donated Amount"
          onChange={(e) => setTotal(Number(e.target.value))}
          placeholder="Gift card total"
        />

        <Typography>
          You will also be charged Stripe's processing fees of ${stripeFees.toFixed(2)}.
        </Typography>

        <Grid container item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Gift Card Design:</FormLabel>
            <RadioGroup
              aria-label="gift-card-design"
              name="gift-card-design"
              value={selectedDesign}
              onChange={(e) => setSelectedDesign(e.target.value)}
            >
              <FormControlLabel
                value={"africa"}
                control={<Radio />}
                label={<Image src="/giftcarddesigns/Hazelfire__Ethiopian_child_youthful_energy_determination_f5bb1138-b23a-4a3b-9ce1-8ee291174cad.png" alt="Ethiopian child" width={160} height={90} />}
              />
              <FormControlLabel
                value={"chicken"}
                control={<Radio />}
                label={<Image src="/giftcarddesigns/Hazelfire_A_chicken_in_a_field_high_quality_print_vibrant_colou_bf1faabf-cd3d-40d0-9faa-21ef1f33e342.png" alt="Chicken" width={160} height={90} />}
              />
              <FormControlLabel
                value={"stars"}
                control={<Radio />}
                label={<Image src="/giftcarddesigns/Hazelfire__Starry_night_sky_galaxies_constellations_16af7e12-ccb9-46a4-abe8-6bce3bfcff7e.png" alt="Starry night" width={160} height={90} />}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <StripeCheckout
          stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""}
          token={onToken}
          amount={(total + stripeFees) * 100} // amount in cents
          currency={currency}
          email={recipientEmail}
        />
      </Form>
    </Layout>
  );
};

export default GiftCardPage;
