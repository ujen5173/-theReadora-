import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
  Img,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface FeedbackEmailProps {
  feedback: string;
  userEmail?: string | undefined;
  from: "github" | "twitter" | "none" | "google" | "friends" | undefined;
}

export const FeedbackEmail = ({
  feedback,
  userEmail,
  from,
}: FeedbackEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Feedback from {userEmail ?? "Anonymous User"}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Container className="bg-white border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[40px] w-[600px] shadow-sm">
            <Section className="text-center mb-8">
              <span className="cursor-pointer select-none text-2xl font-black text-[#ee1952]">
                [theReadora]
              </span>
            </Section>

            <Heading className="text-slate-700 text-[28px] font-bold text-center p-0 my-[30px] mx-0">
              New Feedback Received
            </Heading>

            <Hr className="border border-solid border-gray-200 my-[32px] mx-0" />

            <Section className="mt-[32px] ">
              <div className="bg-gray-50 border border-slate-600 rounded-lg p-6">
                <Text className="text-gray-600 text-[14px] leading-[24px] font-medium">
                  From: {userEmail ?? "Anonymous User"}
                </Text>
                <Text className="text-gray-600 text-[14px] leading-[24px] font-medium mt-2">
                  Source: {(from ?? "n/a").toUpperCase()}
                </Text>
              </div>

              <div className="mt-6 bg-white rounded-lg p-6 border border-gray-100">
                <Text className="text-gray-800 text-[16px] leading-[28px] whitespace-pre-wrap">
                  {feedback}
                </Text>
              </div>
            </Section>

            <Hr className="border border-solid border-gray-200 my-[32px] mx-0" />

            <Section className="text-center">
              <Text className="text-gray-500 text-[12px] leading-[20px] mb-4">
                This feedback was sent from Readora
              </Text>

              <Text className="text-gray-400 text-[12px]">
                © {new Date().getFullYear()} Readora. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default FeedbackEmail;
