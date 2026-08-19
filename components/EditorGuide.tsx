import type { ComponentType, ReactNode } from 'react'
import {
  CheckmarkCircleIcon,
  ComposeIcon,
  DocumentIcon,
  EyeOpenIcon,
  ProjectsIcon,
  PublishIcon,
  RocketIcon,
  WarningOutlineIcon,
} from '@sanity/icons'
import { Badge, Box, Card, Flex, Grid, Heading, Stack, Text } from '@sanity/ui'

interface WorkflowStep {
  title: string
  description: string
  icon: ComponentType
}

const workflow: WorkflowStep[] = [
  {
    title: 'Create a draft',
    description: 'Choose the right content area and start with the single creation option shown.',
    icon: ComposeIcon,
  },
  {
    title: 'Complete and validate',
    description: 'Fill every required field, add image descriptions and resolve red validation markers.',
    icon: CheckmarkCircleIcon,
  },
  {
    title: 'Preview the real page',
    description: 'Open Presentation and check desktop and mobile views before requesting review.',
    icon: EyeOpenIcon,
  },
  {
    title: 'Review and publish',
    description: 'Leave the draft ready for review. An administrator performs the final checks and publishes it.',
    icon: PublishIcon,
  },
]

interface GuideCardProps {
  title: string
  icon: ComponentType
  children: ReactNode
}

function GuideCard({ title, icon: Icon, children }: GuideCardProps) {
  return (
    <Card border padding={4} radius={3} height="fill">
      <Stack space={3}>
        <Flex align="center" gap={3}>
          <Icon aria-hidden />
          <Heading as="h3" size={1}>{title}</Heading>
        </Flex>
        <Text size={1} muted>{children}</Text>
      </Stack>
    </Card>
  )
}

/** Native, responsive onboarding surface for nontechnical Studio editors. */
export function EditorGuide() {
  return (
    <Box as="main" padding={[3, 4, 5]} style={{ maxWidth: 1120, margin: '0 auto' }}>
      <Stack space={[5, 6]}>
        <Card padding={[4, 5]} radius={4} tone="primary">
          <Stack space={4}>
            <Flex align="center" gap={3} wrap="wrap">
              <RocketIcon aria-hidden />
              <Badge tone="primary">Editor guide</Badge>
            </Flex>
            <Stack space={3}>
              <Heading as="h1" size={4}>Publish with confidence</Heading>
              <Text size={2} muted>
                Create and preview safely in Studio. Editors prepare drafts; administrators approve publishing,
                unpublishing and deletion.
              </Text>
            </Stack>
          </Stack>
        </Card>

        <Box as="section" aria-labelledby="workflow-heading">
          <Stack space={4}>
            <Heading id="workflow-heading" as="h2" size={2}>The publishing workflow</Heading>
            <Grid columns={[1, 1, 2, 4]} gap={3}>
              {workflow.map((step, index) => {
                const Icon = step.icon
                return (
                  <Card key={step.title} border padding={4} radius={3} height="fill">
                    <Stack space={3}>
                      <Flex align="center" justify="space-between">
                        <Icon aria-hidden />
                        <Badge mode="outline">Step {index + 1}</Badge>
                      </Flex>
                      <Heading as="h3" size={1}>{step.title}</Heading>
                      <Text size={1} muted>{step.description}</Text>
                    </Stack>
                  </Card>
                )
              })}
            </Grid>
          </Stack>
        </Box>

        <Box as="section" aria-labelledby="content-heading">
          <Stack space={4}>
            <Heading id="content-heading" as="h2" size={2}>Choose the right content area</Heading>
            <Grid columns={[1, 1, 3]} gap={3}>
              <GuideCard title="Blog posts" icon={DocumentIcon}>
                Use Editorial for articles. Add a clear headline, summary, author, category, cover image, body,
                publication date and search information.
              </GuideCard>
              <GuideCard title="Labs projects" icon={ProjectsIcon}>
                Use Product for research and Labs work. Set the project status, display order, dates, partner and
                primary action deliberately.
              </GuideCard>
              <GuideCard title="Announcements" icon={WarningOutlineIcon}>
                Use Marketing for the website banner. Keep the message concise and activate only the single notice
                that should be visible.
              </GuideCard>
            </Grid>
          </Stack>
        </Box>

        <Grid columns={[1, 1, 2]} gap={3}>
          <Card border padding={4} radius={3} tone="caution">
            <Stack space={3}>
              <Heading as="h2" size={1}>When Studio shows an error</Heading>
              <Text size={1} muted>
                Follow the message beside the field. Check Needs attention for unfinished records and do not create
                duplicates to bypass a slug, featured-post or active-announcement conflict.
              </Text>
            </Stack>
          </Card>
          <Card border padding={4} radius={3} tone="positive">
            <Stack space={3}>
              <Heading as="h2" size={1}>Before requesting review</Heading>
              <Text size={1} muted>
                Read the page in Presentation, test every link, check image alternatives, verify dates and inspect
                both desktop and mobile views. Then leave the document as a draft for an administrator.
              </Text>
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Box>
  )
}
