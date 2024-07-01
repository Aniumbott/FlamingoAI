import { getAIModels } from "@/app/controllers/aiModel";
import { createChatFork } from "@/app/controllers/chat";
import { IAIModelDocument } from "@/app/models/AIModel";
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
import { useListState } from "@mantine/hooks";
import { IconBuilding } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function ForkChatModal(props: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  message: any;
  chat: any;
}) {
  const { isOpen, setIsOpen, message, chat } = props;
  const [scope, setScope] = useState("viewOnly");
  const [models, handleModels] = useListState<IAIModelDocument>([]);
  const [model, setModel] = useState<IAIModelDocument | null>(null);
  const { organization } = useOrganization();
  const [chatName, setChatName] = useState("Fork of Chat");
  // const [chat, setChat] = useState<any>({});
  const [isCommentsIncluded, setIsCommentsIncluded] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    setChatName(`Fork of ${chat?.name}`);
    const fetchModels = async () => {
      const res = await getAIModels(organization?.id || "");
      handleModels.setState(res.aiModels);
      setModel(models.find((model) => model._id == chat.aiModel) || null);
    };
    fetchModels();
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
          data={models.map((model) => {
            return {
              value: model._id,
              label: model.name,
              group: model.provider,
            };
          })}
          defaultValue={model?._id}
          onChange={(e) =>
            setModel(models.find((model) => model._id == e) || null)
          }
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
          mt="1.5rem"
          defaultChecked={isCommentsIncluded}
          onChange={(e) => setIsCommentsIncluded(e.currentTarget.checked)}
        />
        <div className="w-full flex flex-row justify-end mt-8">
          <Button
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
                isCommentsIncluded,
                model?._id
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
