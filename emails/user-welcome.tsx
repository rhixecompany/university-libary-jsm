import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from '@react-email/components'
import * as React from 'react'

const WelcomeEmail = ({
  username = 'Steve',
  company = 'ACME',
}: WelcomeEmailProps) => {
  const previewText = `Welcome to ${company}, ${username}!`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 w-[465px] p-5">
            <Section className="mt-8">
              <Img
                src={`${baseUrl}/static/example-logo.png`}
                width="80"
                height="80"
                alt="Logo Example"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              Welcome to <strong>{company}</strong>, {username}!
            </Heading>
            <Text className="text-sm">Hello {username},</Text>
            <Text className="text-sm">
              We're excited to have you onboard at <strong>{company}</strong>.
              We hope you enjoy your journey with us. If you have any questions
              or need assistance, feel free to reach out.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                // pX={20}
                // pY={12}
                className="rounded-sm bg-[#00A3FF] text-center text-xs font-semibold text-white no-underline"
                href={`${baseUrl}/get-started`}
              >
                Get Started
              </Button>
            </Section>
            <Text className="text-sm">
              Cheers,
              <br />
              The {company} Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

interface WelcomeEmailProps {
  username?: string
  company?: string
}

const baseUrl = process.env.URL ? `https://${process.env.URL}` : ''

export default WelcomeEmail
