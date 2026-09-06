import * as React from "react";
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export interface RegistrationConfirmationEmailProps {
  attendeeName?: string;
  workshopTitle?: string;
  workshopDate?: string;
  workshopLocation?: string;
  confirmationNumber?: string;
  amountPaid?: string;
  dashboardUrl?: string;
}

export const RegistrationConfirmationEmail = ({
  attendeeName = "Attendee",
  workshopTitle = "Advanced React Workshop",
  workshopDate = "October 15, 2026",
  workshopLocation = "Online (Zoom)",
  confirmationNumber = "REG-XXXXXX",
  amountPaid = "$49.00",
  dashboardUrl = "http://localhost:3000/dashboard",
}: RegistrationConfirmationEmailProps) => {
  const previewText = `You're registered for ${workshopTitle}!`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-800 m-0 p-0">
          <Container className="max-w-[600px] mx-auto my-[40px] bg-white rounded-lg border border-solid border-gray-200 p-[40px] shadow-sm">
            {/* Header */}
            <Section className="mb-[24px] text-center">
              <Text className="text-3xl m-0">🎉</Text>
              <Heading className="text-2xl font-bold text-gray-900 m-0 mt-2">
                Registration Confirmed!
              </Heading>
              <Text className="text-base text-gray-500 m-0 mt-1">
                You&apos;re all set for the workshop
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[20px]" />

            {/* Greeting */}
            <Section className="mb-[24px]">
              <Text className="text-base text-gray-700 leading-relaxed m-0">
                Hi {attendeeName}, thank you for registering! We&apos;re excited to
                have you join us. Here are your registration details:
              </Text>
            </Section>

            {/* Registration Details Card */}
            <Section className="bg-gray-50 rounded-lg p-[24px] mb-[24px] border border-solid border-gray-100">
              <Heading as="h2" className="text-lg font-semibold text-gray-800 m-0 mb-4">
                {workshopTitle}
              </Heading>

              <Row className="mb-2">
                <Column className="w-[120px]">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider m-0">
                    Date
                  </Text>
                </Column>
                <Column>
                  <Text className="text-sm font-medium text-gray-800 m-0">
                    {workshopDate}
                  </Text>
                </Column>
              </Row>

              <Row className="mb-2">
                <Column className="w-[120px]">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider m-0">
                    Location
                  </Text>
                </Column>
                <Column>
                  <Text className="text-sm font-medium text-gray-800 m-0">
                    {workshopLocation}
                  </Text>
                </Column>
              </Row>

              <Row className="mb-2">
                <Column className="w-[120px]">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider m-0">
                    Confirmation #
                  </Text>
                </Column>
                <Column>
                  <Text className="text-sm font-bold text-gray-900 m-0">
                    {confirmationNumber}
                  </Text>
                </Column>
              </Row>

              <Hr className="border-gray-200 my-3" />

              <Row>
                <Column>
                  <Text className="text-sm font-semibold text-gray-900 m-0">
                    Amount Paid
                  </Text>
                </Column>
                <Column className="text-right">
                  <Text className="text-lg font-bold text-green-600 m-0">
                    {amountPaid}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={dashboardUrl}
                className="bg-black text-white font-medium text-sm px-8 py-3 rounded-md text-center inline-block"
              >
                View Your Registration
              </Button>
            </Section>

            {/* What to Expect */}
            <Section className="mb-[24px]">
              <Heading as="h3" className="text-sm font-bold text-gray-900 uppercase tracking-wider m-0 mb-2">
                What to Expect
              </Heading>
              <Text className="text-sm text-gray-600 leading-relaxed m-0">
                • A Zoom link will be sent 24 hours before the workshop{"\n"}
                • Please ensure you have Node.js 18+ and VS Code installed{"\n"}
                • The workshop will be recorded and shared with all attendees
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[24px]" />

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-xs text-gray-400 m-0 leading-normal">
                If you have any questions, reply to this email or contact us at
                support@eventplatform.com
              </Text>
              <Text className="text-xs text-gray-400 mt-2 m-0">
                Event Platform Inc. — Built with ❤️
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RegistrationConfirmationEmail;
