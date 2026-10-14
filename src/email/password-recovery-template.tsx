import {
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordRecoveryTemplateProps {
  username: string;
  otp: string | number;
}

const PasswordRecoveryTemplate = ({
  username,
  otp,
}: PasswordRecoveryTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your MSCAN password recovery code</Preview>

      <Container style={{ padding: "24px", fontFamily: "Arial" }}>
        <Section>
          <Heading as="h2">Password recovery</Heading>

          <Text>Hi {username},</Text>

          <Text>
            Use the verification code below to reset your MSCAN password.
          </Text>

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
            This code will expire in <b>10 minutes</b>. If you did not request
            it, you can ignore this email.
          </Text>

          <Hr />

          <Text style={{ fontSize: "12px", color: "#888" }}>
            This message was sent by MSCAN automated recovery.
          </Text>
        </Section>
      </Container>
    </Html>
  );
};

export { PasswordRecoveryTemplate };
