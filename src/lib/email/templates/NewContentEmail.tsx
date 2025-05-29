import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface NewContentEmailProps {
  userEmail: string;
  authorName: string;
  contentTitle: string;
  contentType: "chapter" | "story";
  contentUrl: string;
}

export const NewContentEmail = ({
  authorName,
  userEmail,
  contentTitle,
  contentType,
  contentUrl,
}: NewContentEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        New {contentType} from {authorName}: {contentTitle}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Container className="bg-white border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[40px] w-[600px] shadow-sm">
            {/* Header with Logo */}
            <Section className="text-center mb-8">
              <span className="cursor-pointer select-none text-2xl font-black text-[#ee1952]">
                [theReadora]
              </span>
            </Section>

            <Heading className="text-slate-700 text-[28px] font-bold text-center p-0 my-[30px] mx-0">
              New {contentType === "chapter" ? "Chapter" : "Story"} Available
            </Heading>

            <Hr className="border border-solid border-gray-200 my-[32px] mx-0" />

            <Section className="mt-[32px]">
              <div className="bg-gray-50 border border-slate-600 rounded-lg p-6">
                <Text className="text-gray-600 text-[14px] leading-[24px] font-medium">
                  From: {authorName}
                </Text>
                <Text className="text-gray-600 text-[14px] leading-[24px] font-medium mt-2">
                  Type:{" "}
                  {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                </Text>
              </div>

              <div className="mt-6 bg-white rounded-lg p-6 border border-gray-100">
                <Text className="text-gray-800 text-[16px] leading-[28px]">
                  Hi {userEmail.split("@")[0]},
                </Text>
                <Text className="text-gray-800 text-[16px] leading-[28px] mt-4">
                  {authorName} has just published a new {contentType}:{" "}
                  <span className="font-semibold text-slate-900">
                    {contentTitle}
                  </span>
                </Text>
              </div>

              <div className="mt-8 text-center">
                <Button
                  className="bg-[#ee1952] hover:bg-[#d41548] rounded-md text-white text-[16px] px-8 py-4 font-semibold no-underline text-center"
                  href={contentUrl}
                >
                  Read Now
                </Button>
              </div>
            </Section>

            <Hr className="border border-solid border-gray-200 my-[32px] mx-0" />

            <Section className="text-center">
              <Text className="text-gray-500 text-[12px] leading-[20px] mb-4">
                You're receiving this email because you're following{" "}
                {authorName}
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

export default NewContentEmail;
