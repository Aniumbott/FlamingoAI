import React, { useState, useEffect } from "react";
import {
  Button,
  Group,
  Modal,
  Stack,
  Title,
  Select,
  Textarea,
} from "@mantine/core";
import { updateChat } from "@/app/controllers/chat";

const SettingsModal = (props: {
  opened: boolean;
  setOpened: (value: boolean) => void;
  chat: any;
  setChat: (value: any) => void;
}) => {
  const { opened, setOpened, chat, setChat } = props;
  const [areaValue, setAreaValue] = useState("");
  const [model, setModel] = useState("");
  useEffect(() => {
    if (chat) {
      setModel(chat?.assistant?.model);
      setAreaValue(chat?.instructions);
    }
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
        <Select
          allowDeselect={false}
          description="Assistant Model"
          data={chat?.assistant?.assistantId?.models}
          value={model}
          onChange={(e) => {
            setModel(e || "");
          }}
        />
        {/* <Stack gap={10}> */}
        <Textarea
          label="Instructions (Chat wide)"
          value={areaValue}
          onChange={(event) => setAreaValue(event.currentTarget.value)}
        />

        {/* </Stack> */}
        <Group justify="flex-end">
          {model != chat?.assistant?.model ||
          areaValue != chat?.instructions ? (
            <Button
              size="md"
              variant="outline"
              onClick={() => {
                setModel(chat?.assistant?.model);
                setAreaValue(chat?.instructions);
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
                instructions: areaValue,
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
