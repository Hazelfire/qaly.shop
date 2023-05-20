import {
  Body,
  Button,
  Section,
  Container,
  Head,
  Html,
  Text,
} from "@react-email/components";

interface PurchaserEmailProps {
  purchaserName: string;
  recipientName: string;
  giftCardId: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const PurchaserEmail = ({
  purchaserName,
  recipientName,
  giftCardId,
}: PurchaserEmailProps) => (
  <Html>
    <Head />
    <Body
      style={{ backgroundColor: "#F7F7F7", fontFamily: "Arial, sans-serif" }}
    >
      <Container
        style={{
          padding: "20px",
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
        }}
      >
        <Text
          style={{ fontSize: "24px", textAlign: "center", margin: "10px 0" }}
        >
          Thank you, {purchaserName}!
        </Text>
        <Text style={{ fontSize: "18px", lineHeight: "1.5", margin: "10px 0" }}>
          Your gift card to {recipientName} has been sent successfully.
        </Text>
        <Text style={{ fontSize: "16px", lineHeight: "1.5", margin: "10px 0" }}>
          Gift Card ID: {giftCardId}
        </Text>
        <Text style={{ fontSize: "16px", lineHeight: "1.5", margin: "10px 0" }}>
          Thank you for your purchase!
        </Text>
      </Container>
    </Body>
  </Html>
);

interface RecipientEmailProps {
  purchaserName: string;
  giftCardId: string;
  customMessage: string;
}

export const RecipientEmail = ({
  purchaserName,
  giftCardId,
  customMessage,
}: RecipientEmailProps) => (
  <Html>
    <Head />
    <Body
      style={{ backgroundColor: "#F7F7F7", fontFamily: "Arial, sans-serif" }}
    >
      <Container
        style={{
          padding: "20px",
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
        }}
      >
        <Text
          style={{ fontSize: "24px", textAlign: "center", margin: "10px 0" }}
        >
          Congratulations!
        </Text>
        <Text style={{ fontSize: "18px", lineHeight: "1.5", margin: "10px 0" }}>
          {"You've"} received a gift card from {purchaserName}!
        </Text>
        <Text style={{ fontSize: "16px", lineHeight: "1.5", margin: "10px 0" }}>
          They included this message for you: {customMessage}
        </Text>
        <Button
          style={{
            display: "block",
            width: "100%",
            backgroundColor: "#5F51E8",
            color: "#fff",
            padding: "10px",
            borderRadius: "4px",
            textAlign: "center",
            textDecoration: "none",
          }}
          href={`${baseUrl}/redeem?giftCardId=${giftCardId}`}
        >
          Redeem your gift card
        </Button>
      </Container>
    </Body>
  </Html>
);

const baseStyle = {
  fontFamily: "Arial, sans-serif",
  padding: "1em",
};

const titleStyle = {
  color: "#333",
  fontSize: "1.25em",
};

const messageStyle = {
  marginTop: "1em",
};

type PurchaserRedeemEmail = {
  purchaserName: string;
  recipientName: string;
};

const listStyle = {
  marginTop: "1em",
  listStyleType: "disc",
  paddingLeft: "1em",
};

export const PurchaserRedeemEmail = ({
  purchaserName,
  recipientName,
}: PurchaserRedeemEmail) => (
  <Html>
    <Head />
    <Body>
      <Container style={baseStyle}>
        <Text style={titleStyle}>Hi {purchaserName},</Text>
        <Text style={messageStyle}>
          Thank you for your purchase. The gift card you bought for{" "}
          {recipientName} has been successfully redeemed!
        </Text>
        <Text style={messageStyle}>Best regards,</Text>
        <Text>qaly.shop</Text>
      </Container>
    </Body>
  </Html>
);

interface charity {
  id: string;
  name: string;
}

interface RecipientRedeemEmailProps {
  charities: charity[];
  recipientName: string;
}

export const RecipientRedeemEmail = ({
  recipientName,
  charities,
}: RecipientRedeemEmailProps) => (
  <Html>
    <Head />
    <Body>
      <Container style={baseStyle}>
        <Text style={titleStyle}>Hi {recipientName},</Text>
        <Text style={messageStyle}>
          Thank you for redeeming your gift card! Here are the charities you
          have chosen to support:
        </Text>
        <Section>
          {charities.map((charity: charity) => (
            <Text key={charity.id} style={listStyle}>
              {charity.name}
            </Text>
          ))}
        </Section>
        <Text style={messageStyle}>Best regards,</Text>
        <Text>The Charity Team</Text>
      </Container>
    </Body>
  </Html>
);
