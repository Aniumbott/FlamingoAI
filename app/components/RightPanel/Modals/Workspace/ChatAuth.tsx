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
} from "@mantine/core";
import { useState } from "react";
import {
  IconUsers,
  IconCreditCard,
  IconInfoCircle,
  IconChecklist,
} from "@tabler/icons-react";

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
  const [selectAPI, setSelectAPI] = useState<string | null>("0");
  const [APIkeys, setAPIkeys] = useState([
    {
      label: "OpenAI Personal API key",
      value: "0",
      key: "1234567890",
      disabled: false,
    },
    {
      label: "OpenAI Workspace API key",
      value: "1",
      key: undefined,
      disabled: false,
    },
    {
      label: "Azure OpenAI Service",
      value: "2",
      key: undefined,
      disabled: true,
    },
    {
      label: "Anthropic",
      value: "3",
      key: undefined,
      disabled: true,
    },
    {
      label: "Anyscale",
      value: "4",
      key: undefined,
      disabled: true,
    },
  ]);
  const [update, setUpdate] = useState<boolean>(false);
  const [updateAPI, setUpdateAPI] = useState("");
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
          value={selectAPI}
          onChange={setSelectAPI}
        />

        <Text size="lg" fw={600} mt={40}>
          OpenAI Connection Settings
        </Text>

        {update ||
        (selectAPI && APIkeys[parseInt(selectAPI)].key == undefined) ? (
          <Group mt={10} align="flex-end" justify="space-between">
            <div className="grow">
              <TextInput
                w="100%"
                label="Input your OpenAI API key"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                onChange={(event) => setUpdateAPI(event.currentTarget.value)}
                required
              />
            </div>

            <Button
              color="teal"
              variant="outline"
              radius={0}
              onClick={() => {
                setUpdate(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="teal"
              radius={0}
              onClick={() => {
                const newAPIkeys = APIkeys.map((k, id) => {
                  if (k.value === selectAPI) {
                    return {
                      ...k,
                      key: updateAPI,
                      disabled: false,
                    };
                  }
                  return k;
                });
                setAPIkeys(newAPIkeys);
                setUpdate(false);
              }}
            >
              Save
            </Button>
          </Group>
        ) : null}

        <Select
          description="Default OpenAI Model"
          data={openAIModels}
          defaultValue={openAIModels[0].value}
          mt={20}
          color="teal"
        />

        {selectAPI && APIkeys[parseInt(selectAPI)].key != undefined ? (
          <>
            <Text
              p={20}
              mt={20}
              c="teal"
              size="sm"
              bg="var(--mantine-color-teal-light)"
              style={{ borderRadius: "8px" }}
            >
              API Key configured! You&apos;re all set!
            </Text>

            {!update ? (
              <Group mt={20} justify="flex-end">
                <Button
                  color="teal"
                  radius={0}
                  onClick={() => {
                    setUpdate(true);
                  }}
                >
                  Update API key
                </Button>
                <Button
                  variant="outline"
                  color="teal"
                  radius={0}
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to clear your personal API key, Without API key you won't be able to communicate with AI models."
                      )
                    ) {
                      const newAPIkeys = APIkeys.map((k, id) => {
                        if (k.value === selectAPI) {
                          return {
                            ...k,
                            key: undefined,
                            disabled: false,
                          };
                        }
                        return k;
                      });
                      setAPIkeys(newAPIkeys);
                      setSelectAPI(newAPIkeys[0].value);
                    }
                  }}
                >
                  Clear API key
                </Button>
              </Group>
            ) : null}
          </>
        ) : null}

        {selectAPI && selectAPI == "1" ? (
          <div>
            <Accordion mt={20} variant="filled" chevronPosition="left">
              <Accordion.Item value="0">
                <Accordion.Control>
                  <Text size="xs">Having problems click here.</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <List listStyleType="disc">
                    <List.Item>
                      <Text size="xs">
                        Only 1 API key is used per workspace.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="xs">
                        Make sure you are an admin of the team or that your
                        admin has added an OpenAI key.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="xs">
                        For the API key to be active, you need to add billing
                        information to the OpenAI Billing portal.
                      </Text>
                    </List.Item>
                  </List>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>
        ) : null}

        <div>
          <Card mt={20} p={20} radius="md">
            <Group>
              <IconUsers
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
              <Text size="xs" w="80%">
                This key will be used by{" "}
                <b>{selectAPI && selectAPI == "0" ? "only you" : "everyone"}</b>{" "}
                in your workspace.
              </Text>
            </Group>
          </Card>
          <Card mt={10} p={20} radius="md">
            <Group>
              <IconCreditCard
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
              <Text size="xs" w="80%">
                You will be billed through the <b>billing portal</b>, rather
                than the ChatGPT Plus product.
              </Text>
            </Group>
          </Card>
          <Card mt={10} p={20} radius="md">
            <Group>
              <IconInfoCircle
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
              <Text size="xs" w="80%">
                A ChatGPT Plus subscription is <b>not</b> required
              </Text>
            </Group>
          </Card>
          <Card mt={10} p={20} radius="md">
            <Group>
              <IconChecklist
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
              <Text size="xs" w="80%">
                We&apos;re going to send a <b>test request</b> as a way to
                ensure that your API key is operational.
              </Text>
            </Group>
          </Card>
        </div>
      </div>
    </Paper>
  );
}
