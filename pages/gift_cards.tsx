import React, { useState, useEffect, ChangeEvent } from "react";
import Layout from "./_layout";
import StripeCheckout from "react-stripe-checkout";
import {Form, FormInput, FormNumber, FormSelect, FormTextarea} from 'components/Form'

const GiftCardPage = () => {
  const [total, setTotal] = useState(0);
  const [stripeFees, setStripeFees] = useState(0);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [isTransactionSuccess, setIsTransactionSuccess] = useState<
    boolean | null
  >(null);

  // New state variables
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
        success={isTransactionSuccess===true}
        submitting={isLoading}
        successMessage="Charity submitted successfully!"
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

        <p>
          {"You will also be charged Stripe's processing fees of $"}
          {stripeFees.toFixed(2)}.
        </p>

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
