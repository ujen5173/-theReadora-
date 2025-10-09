import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  magicLink: string;
  userEmail: string;
}

export default function MagicLinkEmail({
  magicLink,
  userEmail,
}: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your magic link to sign in to [theReadora]</Preview>
      <Body style={main}>
        {/* Background Pattern */}
        <div style={backgroundPattern}></div>

        <Container style={container}>
          {/* Header Section */}
          <Section style={headerSection}>
            <Text style={logo}>[theReadora]</Text>
            <Text style={tagline}>Discover and share your favorite reads!</Text>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Heading style={h1}>Welcome Back Chief! 👋</Heading>

            <Text style={text}>
              You're just one click away from accessing your account. Click the
              button below to sign in securely:
            </Text>

            {/* Magic Link Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={magicLink}>
                Sign in to [theReadora]
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section style={linkSection}>
              <Text style={linkText}>
                If the button doesn't work, copy and paste this link into your
                browser:
              </Text>
              <Text style={linkUrl}>{magicLink}</Text>
            </Section>

            {/* Security Info */}
            <Section style={securitySection}>
              <Text style={securityText}>
                🔒 This link is secure and will expire in 24 hours. It can only
                be used once for your safety.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footerSection}>
            <Text style={footerText}>
              If you didn't request this email, you can safely ignore it. Your
              account remains secure.
            </Text>
            <Text style={footerText}>
              Happy reading! 📚
              <br />
              The [theReadora] Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles matching your actual website design
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  margin: "0",
  padding: "20px 0",
  minHeight: "100vh",
  position: "relative" as const,
};

const backgroundPattern = {
  position: "absolute" as const,
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  background:
    "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(255, 255, 255, 1) 50%, rgba(245, 158, 11, 0.1) 100%)",
  opacity: "0.3",
  zIndex: "-1",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  border: "1px solid rgba(245, 158, 11, 0.1)",
  position: "relative" as const,
  zIndex: "1",
};

const headerSection = {
  background:
    "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(255, 255, 255, 1) 100%)",
  padding: "40px 32px 32px 32px",
  textAlign: "center" as const,
  borderBottom: "1px solid rgba(245, 158, 11, 0.1)",
  position: "relative" as const,
};

const logo = {
  fontSize: "36px",
  fontWeight: "900",
  color: "rgba(245, 158, 11, 0.9)", // primary color with slight transparency
  margin: "0 0 12px 0",
  letterSpacing: "-0.02em",
  fontFamily: '"Kanit", -apple-system, BlinkMacSystemFont, sans-serif',
  textShadow: "0 2px 4px rgba(245, 158, 11, 0.1)",
};

const tagline = {
  fontSize: "18px",
  color: "#64748b", // slate-500
  margin: "0",
  fontWeight: "500",
  fontStyle: "italic",
};

const contentSection = {
  padding: "40px 32px",
  backgroundColor: "#ffffff",
};

const h1 = {
  color: "#475569", // slate-600
  fontSize: "32px",
  fontWeight: "800",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
  lineHeight: "1.2",
  fontFamily: '"Merriweather", Georgia, serif',
  letterSpacing: "-0.01em",
};

const text = {
  color: "#64748b", // slate-500
  fontSize: "18px",
  lineHeight: "1.7",
  margin: "0 0 32px 0",
  textAlign: "center" as const,
  fontWeight: "500",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "40px 0",
};

const button = {
  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", // primary gradient
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 40px",
  border: "none",
  boxShadow:
    "0 10px 15px -3px rgba(245, 158, 11, 0.4), 0 4px 6px -2px rgba(245, 158, 11, 0.2)",
  transition: "all 0.3s ease",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const linkSection = {
  background:
    "linear-gradient(135deg, rgba(245, 158, 11, 0.03) 0%, rgba(248, 250, 252, 1) 100%)",
  padding: "24px",
  borderRadius: "12px",
  margin: "32px 0",
  border: "1px solid rgba(245, 158, 11, 0.1)",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
};

const linkText = {
  color: "#64748b", // slate-500
  fontSize: "16px",
  margin: "0 0 16px 0",
  textAlign: "center" as const,
  fontWeight: "500",
};

const linkUrl = {
  color: "#3b82f6", // blue-500
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
  margin: "0",
  textAlign: "center" as const,
  backgroundColor: "#ffffff",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontFamily: "monospace",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
};

const securitySection = {
  background:
    "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(254, 243, 199, 0.5) 100%)",
  padding: "20px",
  borderRadius: "12px",
  margin: "32px 0",
  border: "1px solid rgba(245, 158, 11, 0.2)",
  boxShadow: "0 4px 6px -1px rgba(245, 158, 11, 0.1)",
};

const securityText = {
  color: "#92400e", // amber-800
  fontSize: "16px",
  margin: "0",
  textAlign: "center" as const,
  fontWeight: "600",
  lineHeight: "1.5",
};

const divider = {
  border: "none",
  borderTop: "1px solid rgba(245, 158, 11, 0.1)",
  margin: "0",
};

const footerSection = {
  padding: "32px",
  background:
    "linear-gradient(135deg, rgba(245, 158, 11, 0.02) 0%, rgba(248, 250, 252, 1) 100%)",
  textAlign: "center" as const,
};

const footerText = {
  color: "#64748b", // slate-500
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
  fontWeight: "500",
};

export { MagicLinkEmail };
