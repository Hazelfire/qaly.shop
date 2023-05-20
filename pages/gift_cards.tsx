import React, { useState, useEffect, ChangeEvent } from "react";
import Layout from "./_layout";
import StripeCheckout from "react-stripe-checkout";

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
      <div className="container">
        <h1>Buy a Charity Gift Card</h1>

        <input
          type="text"
          value={purchaserName}
          onChange={(e) => setPurchaserName(e.target.value)}
          placeholder="Your name"
        />

        <input
          type="email"
          value={purchaserEmail}
          onChange={(e) => setPurchaserEmail(e.target.value)}
          placeholder="Your email"
        />

        <input
          type="text"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="Recipient name"
        />

        <input
          type="email"
          value={recipientEmail}
          onChange={handleRecipientEmailChange}
          placeholder="Recipient email"
        />

        <label>
          Select currency:
          <select value={currency} onChange={handleCurrencyChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="AUD">AUD</option>
            {/* Add more options as needed */}
          </select>
        </label>

        <input
          type="text"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Your custom message"
        />

        <input
          type="text"
          value={total}
          onChange={handleTotalChange}
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

        {isLoading && <div>Processing your transaction...</div>}
        {transactionStatus && (
          <div className={isTransactionSuccess ? "success" : "error"}>
            {transactionStatus}
          </div>
        )}

        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1em;
          }

          h1 {
            color: #333;
            margin-bottom: 1em;
          }

          input {
            margin-bottom: 0.5em;
            padding: 0.5em;
            width: 100%;
            max-width: 300px;
          }

          label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            max-width: 300px;
            margin-bottom: 0.5em;
          }

          select {
            margin-left: 0.5em;
          }

          .success {
            color: green;
          }

          .error {
            color: red;
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default GiftCardPage;
