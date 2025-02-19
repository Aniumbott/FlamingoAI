import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  List,
  ListItem,
  Slider,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

export default function ProCard(props: { isMonthly: boolean }) {
  const { isMonthly } = props;
  const [proValue, setProValue] = useState(10);
  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Card mih={530} radius="md" w={330} shadow="lg" withBorder>
      <Group justify="space-between">
        <Title order={4} c="var(--mantine-primary-color-filled)">
          PRO
        </Title>
        <Badge variant="light">Save 17% yearly</Badge>
      </Group>
      <Title order={2} mt="md">
        Collaborate
      </Title>
      <Text c="dimmed" ta="right" mt="xl">
        {isMonthly ? "Billed per month" : "Billed per year"}
      </Text>
      <Group align="flex-end" gap={"5px"} mt="md">
        <Title order={1}>${proValue * (isMonthly ? 2 : 20)}</Title>
        <Text>/team/{isMonthly ? "month" : "year"}</Text>
      </Group>
      <Slider
        step={10}
        min={10}
        max={500}
        size={"lg"}
        value={proValue}
        onChange={setProValue}
      />
      <Text ta="center"> {proValue} users</Text>
      <Text c="dimmed">+AI usage cost</Text>
      <List mt="xl" icon={<IconCheck size="20px" />}>
        <ListItem c="var(--mantine-primary-color-filled)">
          Everything in FREE
        </ListItem>
        <ListItem>Up to 500 people</ListItem>
        <ListItem>Personal OpenAI API keys</ListItem>
        <ListItem>Azure OpenAI Integration</ListItem>
        <ListItem>Members roles and permissions</ListItem>
      </List>
      <Anchor href="/workspace">
        <Button mt="xl" variant="outline" fullWidth={isMobile ? true : false}>
          Upgrade Now
        </Button>
      </Anchor>
    </Card>
  );
}
