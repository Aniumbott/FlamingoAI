import { getFormattedResponse } from "@/app/controllers/pages";
import { useAuth } from "@clerk/nextjs";
import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  ComboboxData,
  Container,
  Group,
  HoverCard,
  Loader,
  Select,
  Stack,
  Text,
  Textarea,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconCircle,
  IconCircleDotted,
  IconInfoCircle,
  IconTextPlus,
  IconTextSpellcheck,
  IconX,
  IconAlignJustified,
  IconStar,
  IconReplace,
  IconRowInsertTop,
  IconRowInsertBottom,
  IconReload,
} from "@tabler/icons-react";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { RichTextEditor } from "@mantine/tiptap";
import { useListState } from "@mantine/hooks";
import { IAIModelDocument } from "@/app/models/AIModel";
import { getWorkspace } from "@/app/controllers/workspace";
import { constructSelectModels, getAIModels } from "@/app/controllers/aiModel";

export default function SidePanel(props: {
  setIsPanelOpened: (value: boolean) => void;
  editor: Editor | null;
  index: number;
  handleEditors: any;
}) {
  const { setIsPanelOpened, editor, index, handleEditors } = props;
  const { colorScheme } = useMantineColorScheme();
  const responseEditor = new Editor({
    editable: false,
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      Color,
      TextStyle,
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
  });
  const [response, setResponse] = useState<string | null>(null);
  const [act, setAct] = useState<string>("");
  const [models, handleModels] = useListState<IAIModelDocument>([]);
  const [selectModel, setSelectModel] = useState<IAIModelDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { orgId } = useAuth();

  useEffect(() => {
    responseEditor.commands.setContent(response || "");
  }, [response]);

  useEffect(() => {
    const fetchAiModels = async () => {
      const resModels = await getAIModels(orgId || "");
      handleModels.setState(resModels.aiModels);

      const res = await getWorkspace(orgId || "");
      res.workspace.apiKeys.map((apiKey: any) => {
        if (apiKey.provider == "openai" && apiKey.scope == "public") {
          setSelectModel(
            resModels?.aiModels?.find(
              (model: any) => model._id == apiKey.aiModel
            ) || models[0]
          );
        }
      });
    };

    fetchAiModels();
  }, []);

  async function getResponse(action: string, aiModel: IAIModelDocument) {
    setIsLoading(true);
    await getFormattedResponse(
      action,
      orgId || "",
      aiModel,
      editor?.getHTML() || ""
    ).then((res: any) => {
      setResponse(res);
      setIsLoading(false);
    });
  }

  return (
    <Card
      radius="md"
      w={"45%"}
      h="100%"
      shadow="sm"
      style={{
        flexGrow: 1,
      }}
    >
      <Stack h={"100%"} gap={"xl"} justify="space-between">
        <Stack>
          <Group justify="flex-end">
            <ActionIcon
              variant="subtle"
              color="grey"
              onClick={() => {
                if (response != null) {
                  if (
                    window.confirm("Are you sure you want to close the panel?")
                  ) {
                    setResponse(null);
                    setAct("");
                    setIsPanelOpened(false);
                  }
                } else {
                  setResponse(null);
                  setAct("");
                  setIsPanelOpened(false);
                }
              }}
            >
              <IconX size={20} />
            </ActionIcon>
          </Group>
          <Select
            searchable
            allowDeselect={false}
            placeholder="Select model"
            value={selectModel?._id || ""}
            data={constructSelectModels(models)}
            onChange={(e) => {
              setSelectModel(
                models.find((model) => model._id == e) || models[0]
              );
            }}
            style={{
              flexGrow: 1,
            }}
          />
          {response == null && !isLoading ? (
            <>
              <Button
                justify="flex-start"
                variant="light"
                leftSection={<IconTextPlus />}
                onClick={() => {
                  setAct("Make the content longer.");
                  getResponse(
                    "Make the content longer.",
                    selectModel || models[0]
                  );
                }}
              >
                Longer
              </Button>
              <Button
                justify="flex-start"
                variant="light"
                leftSection={<IconAlignJustified />}
                onClick={() => {
                  setAct("Make the content shorter.");
                  getResponse(
                    "Make the content shorter.",
                    selectModel || models[0]
                  );
                }}
              >
                Shorter
              </Button>
              <Button
                justify="flex-start"
                variant="light"
                leftSection={<IconCircle />}
                onClick={() => {
                  setAct("Simplify the content.");
                  getResponse(
                    "Simplify the content.",
                    selectModel || models[0]
                  );
                }}
              >
                Simpler
              </Button>
              <Button
                justify="flex-start"
                variant="light"
                leftSection={<IconCircleDotted />}
                onClick={() => {
                  setAct("Summarize the content.");
                  getResponse(
                    "Summarize the content.",
                    selectModel || models[0]
                  );
                }}
              >
                Summarize
              </Button>
              <Button
                justify="flex-start"
                variant="light"
                leftSection={<IconStar />}
                onClick={() => {
                  setAct("Improve the writing of the content.");
                  getResponse(
                    "Improve the writing of the content.",
                    selectModel || models[0]
                  );
                }}
              >
                Improve Writing
              </Button>
              <Button
                justify="flex-start"
                variant="light"
                leftSection={<IconTextSpellcheck />}
                onClick={() => {
                  setAct(
                    "Fix the grammar and spellings mistakes in the content."
                  );
                  getResponse(
                    "Fix the grammar and spellings mistakes in the content.",
                    selectModel || models[0]
                  );
                }}
              >
                Fix grammar & spelling
              </Button>
            </>
          ) : (
            <Stack>
              <div className="flex justify-end">
                <Card
                  shadow="0"
                  radius="lg"
                  style={{
                    borderTopRightRadius: 0,
                    background:
                      colorScheme == "light"
                        ? "var(--mantine-color-gray-1)"
                        : "var(--mantine-color-dark-7)",
                  }}
                >
                  <Text>{act}</Text>
                </Card>
              </div>
              <div className="flex justify-start flex-col">
                <Card
                  p={0}
                  shadow="0"
                  radius="lg"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopLeftRadius: 0,
                    background:
                      colorScheme == "light"
                        ? "var(--mantine-color-gray-1)"
                        : "var(--mantine-color-dark-7)",
                  }}
                >
                  {isLoading ? (
                    <Loader type="dots" m="md" />
                  ) : (
                    <RichTextEditor
                      p="0"
                      m="0"
                      editor={responseEditor}
                      style={{
                        border: "none",
                      }}
                    >
                      <RichTextEditor.Content p="0" m="0" />
                    </RichTextEditor>
                  )}
                </Card>
                <Card
                  w="100%"
                  mt="sm"
                  radius={"lg"}
                  style={{
                    background:
                      colorScheme == "light"
                        ? "var(--mantine-color-gray-1)"
                        : "var(--mantine-color-dark-7)",
                  }}
                >
                  <Group justify="space-around">
                    <Button
                      size="lg"
                      variant="light"
                      color="grey"
                      radius="md"
                      w="5rem"
                      h="5rem"
                      p="xs"
                      onClick={() => {
                        editor?.commands.setContent(response);
                        setResponse(null);
                        setAct("");
                        setIsPanelOpened(false);
                      }}
                    >
                      <Container w="100%" p="0" m="0">
                        <IconReplace size={20} />
                        <Text size="xs" c="dimmed">
                          Replace
                        </Text>
                      </Container>
                    </Button>
                    <Button
                      size="lg"
                      variant="light"
                      color="grey"
                      radius="md"
                      w="5rem"
                      h="5rem"
                      p="xs"
                      onClick={() => {
                        handleEditors.insert(
                          index,
                          new Editor({
                            content: response,
                            extensions: [
                              StarterKit,
                              Underline,
                              Link,
                              Superscript,
                              Subscript,
                              Highlight,
                              Color,
                              TextStyle,
                              FontFamily,
                              TextAlign.configure({
                                types: ["heading", "paragraph"],
                              }),
                            ],
                          })
                        );
                        setResponse(null);
                        setAct("");
                        setIsPanelOpened(false);
                      }}
                    >
                      <Container w="100%" p="0" m="0">
                        <IconRowInsertTop size={20} />
                        <Text size="xs" c="dimmed">
                          Insert <br /> Above
                        </Text>
                      </Container>
                    </Button>
                    <Button
                      size="lg"
                      variant="light"
                      color="grey"
                      radius="md"
                      w="5rem"
                      h="5rem"
                      p="xs"
                      onClick={() => {
                        handleEditors.insert(
                          index + 1,
                          new Editor({
                            content: response,
                            extensions: [
                              StarterKit,
                              Underline,
                              Link,
                              Superscript,
                              Subscript,
                              Highlight,
                              Color,
                              TextStyle,
                              FontFamily,
                              TextAlign.configure({
                                types: ["heading", "paragraph"],
                              }),
                            ],
                          })
                        );
                        setResponse(null);
                        setAct("");
                        setIsPanelOpened(false);
                      }}
                    >
                      <Container w="100%" p="0" m="0">
                        <IconRowInsertBottom size={20} />
                        <Text size="xs" c="dimmed">
                          Insert <br /> Below
                        </Text>
                      </Container>
                    </Button>
                    <Button
                      size="lg"
                      variant="light"
                      color="grey"
                      radius="md"
                      w="5rem"
                      h="5rem"
                      p="xs"
                      onClick={() => {
                        getResponse(act, selectModel || models[0]);
                      }}
                    >
                      <Container w="100%" p="0" m="0">
                        <IconReload size={20} />
                        <Text size="xs" c="dimmed">
                          Try <br /> Again
                        </Text>
                      </Container>
                    </Button>
                  </Group>
                </Card>
              </div>
            </Stack>
          )}
        </Stack>
        <Stack>
          <Textarea
            placeholder="Describe the changes you want to see.."
            label="Custom Instructions"
            value={act}
            onChange={(e) => setAct(e.currentTarget.value)}
            autosize={true}
            minRows={4}
            maxRows={4}
          />
          <Group
            align="flex-start"
            gap={"xs"}
            style={{
              flexWrap: "nowrap",
            }}
          >
            <Checkbox
              size={"xs"}
              label="Consider all the information on the page"
            />
            <HoverCard width={280} shadow="md">
              <HoverCard.Target>
                <IconInfoCircle size={15} />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="sm">
                  Hover card is revealed when user hovers over target element,
                  it will be hidden once mouse is not over both target and
                  dropdown elements
                </Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
          <Group justify="flex-end">
            <Button
              w={"fit-content"}
              onClick={() => {
                getResponse(act, selectModel || models[0]);
              }}
            >
              Send
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}
