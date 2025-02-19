import {
  Anchor,
  Badge,
  Button,
  Card,
  Chip,
  Group,
  List,
  ListItem,
  Pill,
  Slider,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

export default function MaxCard(props: { isMonthly: boolean }) {
  const { isMonthly } = props;
  const [maxValue, setMaxValue] = useState(10);
  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Card mih={530} radius="md" w={330} shadow="lg" withBorder>
      <Group justify="space-between">
        <Title order={4} c="var(--mantine-primary-color-filled)">
          MAX
        </Title>
        <Badge variant="light">Save 17% yearly</Badge>
      </Group>
      <Title order={2} mt="md">
        Step up
      </Title>
      <Text c="dimmed" ta="right" mt="xl">
        {isMonthly ? "Billed per month" : "Billed per year"}
      </Text>
      <Group align="flex-end" gap={"5px"} mt="md">
        <Title order={1}>${maxValue * (isMonthly ? 5 : 50)}</Title>
        <Text>/team/{isMonthly ? "month" : "year"}</Text>
      </Group>
      <Slider
        step={10}
        min={10}
        max={500}
        size={"lg"}
        value={maxValue}
        onChange={setMaxValue}
      />
      <Text ta="center"> {maxValue} users</Text>
      <Text c="dimmed">+AI usage cost</Text>
      <List mt="xl" icon={<IconCheck size="20px" />}>
        <ListItem>Everything in PRO</ListItem>
        <ListItem c="var(--mantine-primary-color-filled)">
          AI Editing with Pages 🪄
        </ListItem>
        <ListItem c="var(--mantine-primary-color-filled)">
          Image generation with DALL·E 3
        </ListItem>
        <ListItem c="var(--mantine-primary-color-filled)">
          Anthropic Claude integration
        </ListItem>
        <ListItem c="var(--mantine-primary-color-filled)">
          Custom models (LLaMa, Mixtral)
        </ListItem>
      </List>
      <Anchor href="/workspace">
        <Button mt="xl" variant="outline" fullWidth={isMobile ? true : false} >
          Upgrade Now
        </Button>
      </Anchor>
    </Card>
  );
}
