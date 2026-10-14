import {
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
  Hr,
  Container,
} from "@react-email/components";

interface VerificationTemplateProps {
  username: string;
  otp: string | number;
}

const VerificationTemplate = ({ username, otp }: VerificationTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your MSCAN verification code</Preview>

      <Container style={{ padding: "24px", fontFamily: "Arial" }}>
        <Section>
          <Heading as="h2">Verify your account</Heading>

          <Text>Hi {username},</Text>

          <Text>Use the verification code below to complete your signup.</Text>

          <Section
            style={{
              textAlign: "center",
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              fontSize: "28px",
              letterSpacing: "6px",
              fontWeight: "bold",
            }}
          >
            {otp}
          </Section>

          <Text style={{ marginTop: "20px" }}>
            This code will expire in <b>10 minutes</b>. Do not share it with
            anyone.
          </Text>

          <Hr />

          <Text style={{ fontSize: "12px", color: "#888" }}>
            If you didn’t request this, you can safely ignore this email.
          </Text>
        </Section>
      </Container>
    </Html>
  );
};

export { VerificationTemplate };
