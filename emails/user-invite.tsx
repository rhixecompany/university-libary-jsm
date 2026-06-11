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
  Tailwind,
  Text,
} from '@react-email/components'
import * as React from 'react'

export const InviteUserEmail = ({
  username = 'user',
  userImage = `${baseUrl}/static/avatar.png`,
  invitedByUsername = 'analasso',
  invitedByEmail = 'analasso@gmail.com',
  teamName = 'Project',
  teamImage = `${baseUrl}/static/example-logo.png`,
  inviteLink = 'https://company.com/teams/invite/foo',
  inviteFromIp = '204.13.186.218',
  inviteFromLocation = 'Greendale',
  company = 'ACME',
}: InviteUserEmailProps) => {
  const previewText = `Join ${invitedByUsername}`

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
              Join <strong>{teamName}</strong> on <strong>{company}</strong>
            </Heading>
            <Text className="text-sm">Hello {username},</Text>
            <Text className="text-sm">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{teamName}</strong> team on{' '}
              <strong>{company}</strong>.
            </Text>
            <Section className="my-8 text-center">
              <Button
                // pX={20}
                // pY={12}
                className="rounded-sm bg-[#00A3FF] text-center text-[12px] font-semibold text-white no-underline"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-sm">
              or copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-6 w-full border border-solid border-[#eaeaea]" />
            <Text className="text-xs opacity-50">
              This invitation was intended for{' '}
              <span className="">{username} </span>.This invite was sent from{' '}
              <span className="">{inviteFromIp}</span> located in{' '}
              <span className="">{inviteFromLocation}</span>. If you were not
              expecting this invitation, you can ignore this email. If you are
              concerned about your account's safety, please reply to this email
              to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

interface InviteUserEmailProps {
  username?: string
  userImage?: string
  invitedByUsername?: string
  invitedByEmail?: string
  teamName?: string
  teamImage?: string
  inviteLink?: string
  inviteFromIp?: string
  inviteFromLocation?: string
  company?: string
}

const baseUrl = process.env.URL ? `https://${process.env.URL}` : ''

export default InviteUserEmail
