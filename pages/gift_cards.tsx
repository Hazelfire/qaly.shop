import styled from "styled-components";
import Layout from "./Layout";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Replace with your own Stripe publishable key
const stripePromise = loadStripe("pk_test_218Wbt0Tcdvhoy44q2rBg3bw");

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
  padding: 20px;
`;

const Label = styled.label`
  font-size: 1.2em;
  margin-bottom: 10px;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 1em;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: #0056b3;
  }
`;

function GiftCardPurchasePage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a new payment intent on the server
    const response = await fetch("/api/charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        email: email,
      }),
    });

    const paymentIntent = await response.json();

    // Fetch your Stripe publishable key if not already loaded
    const stripe = await stripePromise;

    const { error } = await stripe.confirmCardPayment(
      paymentIntent.client_secret
    );

    if (error) {
      console.log(error);
    } else {
      console.log("Payment succeeded!");
    }
  };

  return (
    <Layout>
      <Form onSubmit={handleSubmit}>
        <Label>
          {"Recipient's Email"}:
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Label>
        <Label>
          Gift Card Amount:
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </Label>
        <Button type="submit">Purchase Gift Card</Button>
      </Form>
    </Layout>
  );
}

export default GiftCardPurchasePage;
