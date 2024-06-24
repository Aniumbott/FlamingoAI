import React, { useState, useEffect } from "react";
import {
  Button,
  Group,
  Modal,
  Stack,
  Title,
  Select,
  Textarea,
  Text,
  Box,
  Switch,
} from "@mantine/core";
import { updateChat } from "@/app/controllers/chat";
import { IPageDocument } from "@/app/models/Page";
import { getAllPages } from "@/app/controllers/pages";

const SettingsModal = (props: {
  opened: boolean;
  setOpened: (value: boolean) => void;
  chat: any;
}) => {
  const { opened, setOpened, chat } = props;
  const [areaValue, setAreaValue] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("text");
  const [pages, setPages] = useState<any[]>([]);
  const [pageId, setPageId] = useState<string | null>("Page 1");
  useEffect(() => {
    if (chat) {
      setModel(chat?.assistant?.model);
      setAreaValue(chat?.instructions.text || "");
      setType(chat?.instructions.type);
      setPageId(chat?.instructions.pageId);
    }

    const fetchAllPages = async () => {
      try {
        setPages(
          (await getAllPages(chat.workspaceId || "")).pages.map(
            (page: IPageDocument) => {
              return { value: page._id, label: page.name };
            }
          )
        );
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      }
    };

    fetchAllPages();
  }, [chat]);
  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
      }}
      padding={20}
      size="xl"
      centered
      withCloseButton={false}
    >
      <Title order={3}>Chat Settings</Title>
      <Stack gap={30} p={20}>
        <Box>
          <Text fz="sm" c="dimmed">
            Assistant Model
          </Text>
          <Select
            allowDeselect={false}
            data={chat?.assistant?.assistantId?.models}
            value={model}
            onChange={(e) => {
              setModel(e || "");
            }}
          />
        </Box>
        {/* <Stack gap={10}> */}

        <Box>
          <Group justify="space-between" mb="xs">
            <Text fz="sm" c="dimmed">
              Instructions (Chat Wide)
            </Text>
            <Group>
              <Text fz="sm" c="dimmed">
                Text
              </Text>
              <Switch
                checked={type == "Page"}
                onChange={(e) => {
                  setType(e.currentTarget.checked ? "Page" : "text");
                }}
              />
              <Text fz="sm" c="dimmed">
                Page
              </Text>
            </Group>
          </Group>
          {type == "Page" ? (
            <Select
              clearable
              placeholder="Default set to (null)"
              data={pages}
              value={pageId}
              onChange={(e) => {
                setPageId(e);
              }}
            />
          ) : (
            <Textarea
              value={areaValue}
              onChange={(event) =>
                setAreaValue(event.currentTarget.value || "")
              }
            />
          )}
        </Box>

        {/* </Stack> */}
        <Group justify="flex-end">
          {model != chat?.assistant?.model ||
          type != chat?.instructions.type ||
          areaValue != chat?.instructions.text ||
          pageId != chat?.instructions.pageId ? (
            <Button
              size="md"
              variant="outline"
              onClick={() => {
                setModel(chat?.assistant?.model);
                setAreaValue(chat?.instructions.text || "");
                setType(chat?.instructions.type);
                setPageId(chat?.instructions.pageId);
              }}
            >
              Reset
            </Button>
          ) : null}
          <Button
            size="md"
            onClick={() => {
              updateChat(chat._id, {
                assistant: {
                  assistantId: chat.assistant.assistantId._id,
                  model: model,
                },
                instructions: {
                  type: type,
                  text: areaValue,
                  pageId: pageId,
                },
              }).then(() => {
                setOpened(false);
              });
            }}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default SettingsModal;
