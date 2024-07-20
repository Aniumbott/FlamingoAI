import {Anchor, Button, Card, List, ListItem, Text, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export default function FreeCard() {
  return (
    <Card
      mih={530}
      radius="md"
      w={330}
      shadow="lg"
      withBorder
      style={{
        border: "1px solid var(--mantine-primary-color-filled)",
      }}
    >
      <Title order={4} c="var(--mantine-primary-color-filled)">
        FREE
      </Title>
      <Title order={2} mt="md">
        Try it out
      </Title>
      <Text c="dimmed" ta="right" mt="xl">
        Up to 2 people
      </Text>
      <Title order={1} mt="md">
        $0
      </Title>
      <Text c="dimmed">+AI usage cost</Text>
      <List mt="xl" icon={<IconCheck size="20px" />}>
        <ListItem>Shared chats</ListItem>
        <ListItem>Prompt library</ListItem>
        <ListItem>Folders and subfolders</ListItem>
        <ListItem>Collaborate in ChatGPT</ListItem>
        <ListItem>Pay-per-use of OpenAI API</ListItem>
      </List>
      <Title order={5} c="dimmed" ta="center" mt="xl">
        No credit card required.
      </Title>
      <Anchor href="/workspace">

      <Button mt="lg">Get Started</Button>
      </Anchor>
    </Card>
  );
}
