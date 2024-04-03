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
  Textarea,
} from "@mantine/core";
import { useState } from "react";

export default function AdvancedSetup(props: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  const { activeTab, setActiveTab } = props;
  const [areaValue, setAreaValue] = useState(
    "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown."
  );
  return (
    <Paper
      style={{ height: "100%", overflowY: "scroll" }}
      display={activeTab === "advancedSetup" ? "block" : "none"}
    >
      <div style={{ padding: "3rem 2rem" }}>
        <Text size="lg" fw={600}>
          Custom Instructions (workspace wide)
        </Text>

        <Text mt={20} size="xs" c="dimmed">
          Use this initial message to establish the framework for your prompts,
          providing necessary context or background information to guide the
          subsequent responses.
        </Text>
        <Text mt={10} size="xs" c="dimmed">
          The custom instructions are applied only for <b>new chats</b>.
        </Text>
        <Textarea
          mt={10}
          value={areaValue}
          onChange={(event) => setAreaValue(event.currentTarget.value)}
          required
        />
        <Group mt={20} justify="space-between">
          {areaValue.length == 0 ? (
            <Button
              radius={0}
              variant="outline"
              color="teal"
              onClick={() => {
                setAreaValue(
                  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown."
                );
              }}
            >
              Reset
            </Button>
          ) : null}
          <Button radius={0} color="teal">
            Save
          </Button>
        </Group>
      </div>
    </Paper>
  );
}
