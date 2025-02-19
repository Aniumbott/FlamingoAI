import { constructSelectModels, getAIModels } from "@/app/controllers/aiModel";
import { createChat } from "@/app/controllers/chat";
import { IAIModelDocument } from "@/app/models/AIModel";
import { IPageDocument } from "@/app/models/Page";
import { useAuth, useOrganization } from "@clerk/nextjs";
import {
  Button,
  Center,
  Modal,
  SegmentedControl,
  Select,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconBuilding } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateChatModal(props: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  page: IPageDocument;
}) {
  const { isOpen, setIsOpen, page } = props;
  const [scope, setScope] = useState("viewOnly");
  const [models, handleModels] = useListState<IAIModelDocument>([]);
  const [model, setModel] = useState<IAIModelDocument | null>(null);
  const { userId, orgId } = useAuth();
  const { organization } = useOrganization();
  const [chatName, setChatName] = useState(page.name);
  const [members, setMembers] = useState<any>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchModels = async () => {
      const res = await getAIModels(orgId || "");
      handleModels.setState(res.aiModels);
    };
    const getmembers = async () => {
      const userList =
        (await organization?.getMemberships())?.map((member: any) => {
          return { ...member.publicUserData, role: member.role };
        }) ?? [];
      setMembers(userList);
    };
    fetchModels().then(() => getmembers());
  }, []);

  useEffect(() => {
    if (models) {
      setModel(models[0]);
    }
  }, [models]);
  // const [chat, setChat] = useState<any>({});

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      title="Create a new Chat with this page"
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
          data={constructSelectModels(models)}
          defaultValue={model?._id}
          onChange={(e) => setModel(models.find((m) => m._id == e) || null)}
        />
        <TextInput
          required
          label="New Chat Name"
          mt="1.5rem"
          value={chatName}
          onChange={(e) => setChatName(e.currentTarget.value)}
        />
        <Text mt="2rem">
          Starting a new chat from this page will create a new <b>{scope}</b>{" "}
          chat, which uses the contents on the page as context.
        </Text>

        <div className="w-full flex flex-row justify-end mt-8">
          <Button
            w="5rem"
            mr="md"
            onClick={() => {
              createChat(
                "public",
                null,
                userId || "",
                orgId || "",
                members,
                chatName,
                {
                  type: "page",
                  text: "",
                  pageId: page._id,
                }
              ).then((res: any) => {
                setIsOpen(false);
                window.history.pushState(
                  {},
                  "",
                  pathname.split("/").slice(0, 3).join("/") + "/" + res.chat._id
                );
              });
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
