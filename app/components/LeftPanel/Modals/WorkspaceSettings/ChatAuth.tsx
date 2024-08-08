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
import { constructSelectModels, getAIModels } from "@/app/controllers/aiModel";
import { updateWorkspace } from "@/app/controllers/workspace";
import { useListState, useMediaQuery } from "@mantine/hooks";
import { IAIModelDocument } from "@/app/models/AIModel";

export default function ChatAuth(props: {
  activeTab: string;
  setActiveTab: (value: string) => void;
  workspace: any;
}) {
  const { activeTab, setActiveTab, workspace } = props;
  const [update, setUpdate] = useState<boolean>(false);
  const [models, handleModels] = useListState<IAIModelDocument>([]);
  const [selectModel, setSelectModel] = useState<IAIModelDocument | null>();
  const [scope, setScope] = useState("public");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const isMobile = useMediaQuery(`(max-width: 48em)`);
  const [routerUpdate, setRouterUpdate] = useState(false);
  const [openRouterKey, setOpenRouterKey] = useState("");


  
  useEffect(() => {
    const collectModels = async () => {
      const res = await getAIModels(workspace?._id);
      console.log(res.aiModels);

      handleModels.setState(res.aiModels);
      return res.aiModels;
    };
    collectModels().then((res) => {
      console.log(workspace?.apiKeys);
      if (workspace?.apiKeys.length > 0) {
        const apiKey = workspace.apiKeys.find(
          (apiKey: any) => apiKey.provider == "openai" && apiKey.scope == scope
        );
        const openRouterKey= workspace.apiKeys.find(
          (apiKey: any) => apiKey.provider == "open-router" && apiKey.scope == scope
        );

        setSelectModel(res.find((model: any) => model._id == apiKey?.aiModel));
        setApiKeyInput(apiKey.key || "");
        setOpenRouterKey(openRouterKey.key || "");
      }
    });
  }, []);

  useEffect(() => {
    if (selectModel) {
      const apiKey = workspace?.apiKeys.find(
        (apiKey: any) =>
          apiKey.provider == selectModel.provider && apiKey.scope == scope
      );
      if (apiKey) {
        setApiKeyInput(apiKey.key || "");
      } else {
        setApiKeyInput("");
      }
    }
  }, [scope, selectModel]);


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
        <div
          className={`flex justify-between items-center mt-5 ${
            isMobile ? "flex-col gap-5" : "flex-row"
          }`}
        >
          <Select
            searchable
            allowDeselect={false}
            placeholder="Select model"
            value={selectModel?._id || ""}
            data={constructSelectModels(models)}
            onChange={(e) => {
              setSelectModel(models.find((model) => model._id == e));
            }}
            style={{
              flexGrow: 1,
            }}
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
          Open Router Connection Settings
        </Text>

        {routerUpdate ||
        (selectModel &&
          workspace &&
          (!workspace.apiKeys.some(
            (apiKey: any) =>
              apiKey.provider == "open-router" && apiKey.scope == scope
          ) ||
            workspace?.apiKeys.some(
              (apiKey: any) =>
                apiKey.provider == "open-router" &&
                apiKey.scope == scope &&
                apiKey.key == ""
            ))) ? (
          <Group mt={10} align="flex-end" justify="space-between">
            <div className="grow">
              <TextInput
                w="100%"
                label={`Input your open-router API key`}
                placeholder="Get API key from your provider dashboard."
                value={openRouterKey}
                onChange={(event) => setOpenRouterKey(event.currentTarget.value)}
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
                  aiModel: selectModel?._id,
                  key: openRouterKey,
                  scope: scope,
                  provider: "open-router",
                };
                let wrksp = { ...workspace };
                if (
                  wrksp.apiKeys.find(
                    (apiKey: any) =>
                      apiKey.provider == "open-router" &&
                      apiKey.scope == scope
                  )
                ) {
                  wrksp.apiKeys = wrksp.apiKeys.map((apiKey: any) => {
                    if (
                      apiKey.provider == "open-router" &&
                      apiKey.scope == scope
                    ) {
                      apiKey.key = openRouterKey;
                      return apiKey;
                    }
                    return apiKey;
                  });
                } else {
                  wrksp.apiKeys.push(key);
                }
                updateWorkspace(wrksp).then(() => {
                  window.location.reload();
                });
                setUpdate(false);
              }}
            >
              Save
            </Button>
          </Group>
        ) : null}

    {selectModel &&
        workspace &&
        workspace?.apiKeys.find(
          (apiKey: any) =>
            apiKey.provider == "open-router" &&
            apiKey.scope == scope &&
            apiKey.key != ""
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
                    setRouterUpdate(true);
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
                        apiKeys: [
                          ...workspace.apiKeys.map((apiKey: any) => {
                            if (
                              apiKey.provider == "open-router" &&
                              apiKey.scope == scope
                            ) {
                              apiKey.key = "";
                              return apiKey;
                            }
                            return apiKey;
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

        <Text size="lg" fw={600} mt={40}>
          OpenAI Connection Settings
        </Text>

        

        {update ||
        (selectModel &&
          workspace &&
          (!workspace.apiKeys.some(
            (apiKey: any) =>
              apiKey.provider == selectModel.provider && apiKey.scope == scope
          ) ||
            workspace?.apiKeys.some(
              (apiKey: any) =>
                apiKey.provider == selectModel.provider &&
                apiKey.scope == scope &&
                apiKey.key == ""
            ))) ? (
          <Group mt={10} align="flex-end" justify="space-between">
            <div className="grow">
              <TextInput
                w="100%"
                label={`Input your ${selectModel?.provider} API key`}
                placeholder="Get API key from your provider dashboard."
                value={apiKeyInput}
                onChange={(event) => setApiKeyInput(event.currentTarget.value)}
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
                  aiModel: selectModel?._id,
                  key: apiKeyInput,
                  scope: scope,
                  provider: selectModel?.provider,
                };
                let wrksp = { ...workspace };
                if (
                  wrksp.apiKeys.find(
                    (apiKey: any) =>
                      apiKey.provider == selectModel?.provider &&
                      apiKey.scope == scope
                  )
                ) {
                  wrksp.apiKeys = wrksp.apiKeys.map((apiKey: any) => {
                    if (
                      apiKey.provider == selectModel?.provider &&
                      apiKey.scope == scope
                    ) {
                      apiKey.key = apiKeyInput;
                      return apiKey;
                    }
                    return apiKey;
                  });
                } else {
                  wrksp.apiKeys.push(key);
                }
                updateWorkspace(wrksp).then(() => {
                  window.location.reload();
                });
                setUpdate(false);
              }}
            >
              Save
            </Button>
          </Group>
        ) : null}

        {selectModel &&
        workspace &&
        workspace?.apiKeys.find(
          (apiKey: any) =>
            apiKey.provider == selectModel.provider &&
            apiKey.scope == scope &&
            apiKey.key != ""
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
                        apiKeys: [
                          ...workspace.apiKeys.map((apiKey: any) => {
                            if (
                              apiKey.provider == selectModel.provider &&
                              apiKey.scope == scope
                            ) {
                              apiKey.key = "";
                              return apiKey;
                            }
                            return apiKey;
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

        {selectModel && scope == "workspace" ? (
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
