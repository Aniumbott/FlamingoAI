import { createChatFork } from "@/app/controllers/chat";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Button,
  Center,
  Modal,
  SegmentedControl,
  Select,
  Switch,
  Tabs,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { IconBuilding } from "@tabler/icons-react";
import { useEffect, useState } from "react";

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

export default function ForkChatModal(props: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  message: any;
  chat: any;
}) {
  const { isOpen, setIsOpen, message, chat } = props;
  const [scope, setScope] = useState("viewOnly");
  const [model, setModel] = useState(openAIModels[0].value);
  const { organization } = useOrganization();
  const [chatName, setChatName] = useState("Fork of Chat");
  // const [chat, setChat] = useState<any>({});
  const [isCommentsIncluded, setIsCommentsIncluded] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    setChatName(`Fork of ${chat?.name}`);
  }, [chat]);

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      title="Fork Chat"
      size="lg"
      centered
    >
      <SegmentedControl
        defaultValue={scope}
        onChange={setScope}
        data={[
          {
            value: "private",
            label: (
              <Center style={{ gap: 10 }}>
                <span>Private</span>
              </Center>
            ),
          },
          {
            value: "viewOnly",
            label: (
              <Center style={{ gap: 10 }}>
                <IconBuilding style={{ width: rem(16), height: rem(16) }} />
                <span>View Only</span>
              </Center>
            ),
          },
          {
            value: "public",
            label: (
              <Center style={{ gap: 10 }}>
                <IconBuilding style={{ width: rem(16), height: rem(16) }} />
                <span>Public</span>
              </Center>
            ),
          },
        ]}
        fullWidth
      />
      <div className="w-full flex flex-col mt-10">
        <Select
          required
          label="Model Name"
          data={openAIModels}
          defaultValue={model}
          onChange={(value) => setModel(value || openAIModels[0].value)}
        />
        <TextInput
          required
          label="New Chat Name"
          mt="1.5rem"
          value={chatName}
          onChange={(e) => setChatName(e.currentTarget.value)}
        />
        <Text mt="2rem">
          Forking this chat will create a new <b>{scope}</b> chat containing all
          preceding messages as well as this one.
        </Text>
        <Switch
          label="Include Comemnts"
          color="teal"
          mt="1.5rem"
          defaultChecked={isCommentsIncluded}
          onChange={(e) => setIsCommentsIncluded(e.currentTarget.checked)}
        />
        <div className="w-full flex flex-row justify-end mt-8">
          <Button
            color="teal"
            w="5rem"
            mr="md"
            onClick={() => {
              createChatFork(
                message._id,
                message.chatId,
                organization?.id || "",
                chatName,
                scope,
                user?.id || "",
                isCommentsIncluded
              );
              setIsOpen(false);
            }}
          >
            OK
          </Button>
          <Button
            w="5rem"
            color="white"
            variant="default"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
