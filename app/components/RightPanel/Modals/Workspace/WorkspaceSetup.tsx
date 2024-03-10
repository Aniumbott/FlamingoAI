import {
  Badge,
  Group,
  Paper,
  Select,
  Text,
  Button,
  TextInput,
  Accordion,
  List,
  Card,
  Switch,
} from "@mantine/core";
import { useState } from "react";

export default function WorkspaceSetup(props: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  const { activeTab, setActiveTab } = props;

  return (
    <Paper
      style={{ height: "100%", overflowY: "scroll" }}
      display={activeTab === "workspaceSetup" ? "block" : "none"}
    >
      <div style={{ padding: "3rem 2rem" }}>
        <Text size="lg" fw={600}>
          Global chat settings
        </Text>
        <Group mt={30} justify="space-between">
          <div>
            <Text size="md" fw={600}>
              Personal Chat
            </Text>
            <Text size="xs" c="dimmed">
              Allow team members to creat personal chat
            </Text>
          </div>
          <Switch color="teal" size="md" />
        </Group>
        <Group mt={20} justify="space-between">
          <div>
            <Text size="md" fw={600}>
              Public Chat
            </Text>
            <Text size="xs" c="dimmed">
              Allow team members to share chats publicaly.
            </Text>
          </div>
          <Switch color="teal" size="md" />
        </Group>
      </div>
    </Paper>
  );
}
