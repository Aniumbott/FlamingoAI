import { Badge, Group, Paper, Select, Text } from "@mantine/core";

const APIkeys = [
  {
    label: "OpenAI Personal API key",
    value: "openai-personal-api-key",
    disabled: false,
  },
  {
    label: "OpenAI Workspace API key",
    value: "a",
    disabled: false,
  },
  {
    label: "Azure OpenAI Service",
    value: "b",
    disabled: true,
  },
  {
    label: "Anthropic",
    value: "c",
    disabled: true,
  },
  {
    label: "Anyscale",
    value: "d",
    disabled: true,
  },
];

const openAIModels = [
  {
    label: "Default (GPT-3.5-Turbo)",
    value: "gpt-3.5-turbo",
  },

  {
    label: "GPT-3.5-turbo-0613",
    value: "gpt-3.5-turbo-0613",
  },
  {
    label: "GPT-3.5-turbo (16k)",
    value: "gpt-3.5-turbo-16k",
  },
  {
    label: "GPT-3.5-turbo-1106 (16k)",
    value: "gpt-3.5-turbo-1106-16k",
  },
  {
    label: "GPT-3.5-turbo-0125 (16k)",
    value: "gpt-3.5-turbo-0125-16k",
  },
  {
    label: "GPT-4 (8k)",
    value: "gpt-4-8k",
  },
  {
    label: "GPT-4-0613 (8k)",
    value: "gpt-4-0613-8k",
  },
  {
    label: "GPT-4-turbo (128k)",
    value: "gpt-4-turbo-128k",
  },
  {
    label: "GPT-4-0125-preview (128k)",
    value: "gpt-4-0125-preview-128k",
  },
  {
    label: "GPT-4-turbo-preview (128k)",
    value: "gpt-4-turbo-preview-128k",
  },
  {
    label: "GPT-4-vison-preview (128k)",
    value: "gpt-4-vison-preview-128k",
  },
  {
    label: "GPT-4 (32k)",
    value: "gpt-4-32k",
    disabled: true,
  },
  {
    label: "GPT-4-0613 (32k)",
    value: "gpt-4-0613-32k",
    disabled: true,
  },
  {
    label: "GPT-4-1106-vison-preview (128k)",
    value: "gpt-4-1106-vison-preview-128k",
    disabled: true,
  },
];

export default function ChatAuth(props: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  const { activeTab, setActiveTab } = props;
  return (
    <Paper
      style={{ height: "100%", overflowY: "scroll" }}
      display={activeTab === "chatAuth" ? "block" : "none"}
    >
      <div style={{ padding: "3rem 2rem" }}>
        <Group w="100%" justify="space-between">
          <Text size="lg" fw={600}>
            Chat Authentication
          </Text>
          <Badge color="teal" ml={20} variant="light" radius="md">
            New
          </Badge>
        </Group>
        <Text size="xs" c="dimmed">
          Specify workspace authentification method.
        </Text>
        <Select
          data={APIkeys}
          mt={10}
          color="teal"
          defaultValue={APIkeys[0].value}
        />

        <Text size="lg" fw={600} mt={40}>
          OpenAI Connection Settings
        </Text>

        <Select
          placeholder="Pick a model"
          data={openAIModels}
          defaultValue={openAIModels[0].value}
          mt={10}
          color="teal"
        />
      </div>
    </Paper>
  );
}
