import {
  Body,
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

const WeeklyDigestEmail = ({ company = 'ACME' }: WeeklyDigestEmailProps) => {
  const previewText = `Weekly digest from ${company} `

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
                alt="Logo example"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              Weekly Digest for you from <strong>{company}</strong>
            </Heading>

            {/* Each Article as a Row */}
            <Row>
              <Column>
                <Img
                  src={`${baseUrl}/static/email-content-1.jpg`}
                  width="110"
                  height="110"
                  alt="Article Thumbnail"
                  className="mr-5 rounded-2xl"
                />
              </Column>
              <Column>
                <Text className="text-sm">
                  <strong>Understanding Photosynthesis: A Deep Dive:</strong>{' '}
                  Photosynthesis is a crucial process for life on Earth.
                  Understand how plants convert light energy into chemical
                  energy, and the impact of this process on our daily lives
                  <Link href={`#`} className="pl-2 text-blue-600 no-underline">
                    Read More
                  </Link>
                </Text>
              </Column>
            </Row>

            <Row>
              <Column>
                <Img
                  src={`${baseUrl}/static/email-content-2.jpg`}
                  width="110"
                  height="110"
                  alt="Article Thumbnail"
                  className="mr-5 rounded-2xl"
                />
              </Column>
              <Column>
                <Text className="text-sm">
                  <strong>The Benefits of Indoor Plants</strong> Learn about the
                  numerous benefits of having indoor plants, from improving air
                  quality to boosting mood and productivity. Discover the best
                  indoor plants for your home or office.
                  <Link href={`#`} className="pl-2 text-blue-600 no-underline">
                    Read More
                  </Link>
                </Text>
              </Column>
            </Row>

            <Row>
              <Column>
                <Img
                  src={`${baseUrl}/static/email-content-3.jpg`}
                  width="110"
                  height="110"
                  alt="Article Thumbnail"
                  className="mr-5 rounded-2xl"
                />
              </Column>
              <Column>
                <Text className="text-sm">
                  <strong>The Future of Plant-Based Foods:</strong> Plant-based
                  foods are gaining popularity for their health and
                  environmental benefits. Explore the future trends of this
                  growing industry and how it could revolutionize our food
                  system.
                  <Link href={`#`} className="pl-2 text-blue-600 no-underline">
                    Read More
                  </Link>
                </Text>
              </Column>
            </Row>

            <Hr className="mx-0 my-6 w-full border border-solid border-[#eaeaea]" />

            <Text className="text-sm">
              You can unsubscribe from these emails or update your email
              preferences{' '}
              <Link href={`#`} className="text-blue-600 no-underline">
                here.
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

interface WeeklyDigestEmailProps {
  company?: string
}

const baseUrl = process.env.URL ? `https://${process.env.URL}` : ''

export default WeeklyDigestEmail
