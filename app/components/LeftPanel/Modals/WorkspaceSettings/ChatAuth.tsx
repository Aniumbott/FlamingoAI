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
  SegmentedControl,
} from "@mantine/core";
import { use, useEffect, useState } from "react";
import {
  IconUsers,
  IconCreditCard,
  IconInfoCircle,
  IconChecklist,
} from "@tabler/icons-react";
import { getAssistants } from "@/app/controllers/assistant";
import { updateWorkspace } from "@/app/controllers/workspace";

export default function ChatAuth(props: {
  activeTab: string;
  setActiveTab: (value: string) => void;
  workspace: any;
}) {
  const { activeTab, setActiveTab, workspace } = props;
  const [update, setUpdate] = useState<boolean>(false);
  const [assistants, setAssistants] = useState<any>([]);
  const [selectAssistant, setSelectAssistants] = useState<string | null>();
  const [scope, setScope] = useState("public");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");

  useEffect(() => {
    const collectAssistants = async () => {
      const res = await getAssistants();
      // console.log("assitants", res);
      setAssistants(res.assistants);
    };
    collectAssistants();
    // console.log("workspace", workspace);

    if (workspace?.assistants.length > 0) {
      // console.log(workspace.assistants[0]);
      setSelectAssistants(workspace.assistants[0].assistantId);
      setApiKey(workspace.assistants[0].apiKey);
      // console.log("assistantID", workspace.assistants[0].assistantId);
      setScope(workspace.assistants[0].scope);
    }
  }, []);

  // useEffect(() => {
  //   setSelectAssistants(assistants[0]?._id || "");
  // }, [assistants]);

  useEffect(() => {
    if (selectAssistant) {
      const key = workspace?.assistants.find(
        (key: any) => key.assistantId == selectAssistant && key.scope == scope
      );
      if (key) {
        setApiKey(key.apiKey || "");
        setModel(key.model || "gpt-3.5-turbo");
      }
    }
  }, [selectAssistant, scope]);

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
          <Badge ml={20} variant="light" radius="md">
            New
          </Badge>
        </Group>
        <Text size="xs" c="dimmed">
          Specify workspace authentification method.
        </Text>
        <div className="flex flex-row justify-between items-center mt-5">
          <Select
            disabled={update}
            allowDeselect={false}
            data={assistants.map((assistant: any) => ({
              label: assistant.name,
              value: assistant._id,
            }))}
            value={selectAssistant}
            onChange={setSelectAssistants}
            w="60%"
          />
          <SegmentedControl
            disabled={update}
            data={[
              {
                label: "Workspace",
                value: "public",
              },

              {
                label: "Personal",
                value: "private",
              },
            ]}
            defaultValue={scope}
            onChange={setScope}
          />
        </div>

        <Text size="lg" fw={600} mt={40}>
          OpenAI Connection Settings
        </Text>

        {update ||
        (selectAssistant &&
          workspace &&
          (!workspace.assistants.some(
            (assistant: any) =>
              assistant.assistantId == selectAssistant &&
              assistant.scope == scope
          ) ||
            workspace?.assistants.some(
              (assistant: any) =>
                assistant.assistantId == selectAssistant &&
                assistant.scope == scope &&
                assistant.apiKey == ""
            ))) ? (
          <Group mt={10} align="flex-end" justify="space-between">
            <div className="grow">
              <TextInput
                w="100%"
                label="Input your OpenAI API key"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(event) => setApiKey(event.currentTarget.value)}
                required
              />
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setUpdate(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const key = {
                  assistantId: selectAssistant,
                  apiKey: apiKey,
                  scope: scope,
                  model: model,
                };
                updateWorkspace({
                  ...workspace,
                  assistants: [
                    ...workspace.assistants.map((assistant: any) => {
                      if (
                        assistant.assistantId == selectAssistant &&
                        assistant.scope == scope
                      )
                        return key;
                      return assistant;
                    }),
                  ],
                }).then(() => {
                  window.location.reload();
                });
                setUpdate(false);
              }}
            >
              Save
            </Button>
          </Group>
        ) : null}

        <Select
          allowDeselect={false}
          description="Default Assistant Model"
          data={assistants.find((a: any) => a._id == selectAssistant)?.models}
          value={model}
          onChange={(value) => {
            let key = workspace?.assistants.find((key: any) => {
              return key.assistantId == selectAssistant && key.scope == scope;
            });
            key.model = value;
            updateWorkspace({
              ...workspace,
              assistants: [
                ...workspace.assistants.map((assistant: any) => {
                  if (
                    assistant.assistantId == selectAssistant &&
                    assistant.scope == scope
                  )
                    return key;
                  return assistant;
                }),
              ],
            });
            setModel(value || "gpt-3.5-turbo");
          }}
          mt={20}
        />

        {selectAssistant &&
        workspace &&
        workspace?.assistants.find(
          (key: any) =>
            key.assistantId == selectAssistant &&
            key.scope == scope &&
            key.apiKey != ""
        ) ? (
          <>
            <Text
              p={20}
              mt={20}
              size="sm"
              bg="var(--mantine-primary-color-light)"
              style={{
                borderRadius: "8px",
                color: "var(--mantine-primary-color-filled)",
              }}
            >
              API Key configured! You&apos;re all set!
            </Text>

            {!update ? (
              <Group mt={20} justify="flex-end">
                <Button
                  onClick={() => {
                    setUpdate(true);
                  }}
                >
                  Update API key
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to clear your personal API key, Without API key you won't be able to communicate with AI models."
                      )
                    ) {
                      updateWorkspace({
                        ...workspace,
                        assistants: [
                          ...workspace.assistants.map((key: any) => {
                            if (
                              key.assistantId == selectAssistant &&
                              key.scope == scope
                            ) {
                              key.apiKey = "";
                              return key;
                            }
                            return key;
                          }),
                        ],
                      });
                    }
                  }}
                >
                  Clear API key
                </Button>
              </Group>
            ) : null}
          </>
        ) : null}

        {selectAssistant && scope == "workspace" ? (
          <div>
            <Accordion mt={20} variant="filled" chevronPosition="left">
              <Accordion.Item value="0">
                <Accordion.Control>
                  <Text size="xs">Having problems click here.</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <List listStyleType="disc" size="xs" withPadding pb={10}>
                    <List.Item w="95%">
                      Only 1 API key is used per workspace.
                    </List.Item>
                    <List.Item w="95%">
                      Make sure you are an admin of the team or that your admin
                      has added an OpenAI key.
                    </List.Item>
                    <List.Item w="95%">
                      For the API key to be active, you need to add billing
                      information to the OpenAI Billing portal.
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
                <b>{scope == "personal" ? "only you" : "everyone"}</b> in your
                workspace.
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
