import {
  ActionIcon,
  Avatar,
  Center,
  CopyButton,
  Divider,
  Group,
  Modal,
  NativeSelect,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
  ScrollArea,
  ThemeIcon,
} from "@mantine/core";
import { IconBuilding, IconCheck, IconCopy } from "@tabler/icons-react";
import { IChatDocument } from "../../../models/Chat";
import { updateChatAccess } from "../../../controllers/chat";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

const ShareChatModal = (props: {
  opened: boolean;
  setOpened: (value: boolean) => void;
  chat: IChatDocument;
  setChat: (value: IChatDocument) => void;
  members: any[];
  organizationName: string;
  userId: string;
}) => {
  const {
    opened,
    setOpened,
    chat,
    setChat,
    members,
    organizationName,
    userId,
  } = props;
  const [isAllowed, setIsAllowed] = useState(false);
  const isMobile = useMediaQuery(`(max-width: 48em)`);
  useEffect(() => {
    const user = members.find((member) => member.userId == userId);
    if (user) {
      setIsAllowed(user.userId == chat.createdBy || user.role == "org:admin");
    }
  }, [members]);
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
      <Title order={3}>Share Chat</Title>
      <Stack gap={30} p={20}>
        <Stack gap={3}>
          <Text size="sm">Chat Link:</Text>
          <Group gap={0}>
            <TextInput
              value={`${window.location}`}
              disabled={true}
              style={{ flexGrow: 1 }}
              rightSection={
                <CopyButton value={`${window.location}`} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Copied" : "Copy"}
                      position="right"
                      fz="xs"
                    >
                      <ActionIcon
                        variant={copied ? "filled" : "light"}
                        onClick={copy}
                        size={36}
                      >
                        {copied ? (
                          <IconCheck size={16} />
                        ) : (
                          <IconCopy size={16} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              }
            />
          </Group>
        </Stack>
        <Group gap={isMobile ? "md" : 50}>
          <Group gap={10}>
            <ThemeIcon variant="filled" size="40px">
              <IconBuilding size={24} />
            </ThemeIcon>
            <Stack gap={3} style={{ flexGrow: 1 }}>
              <Title order={4}>{organizationName}</Title>
              <Text size="sm" c="grey">
                Teammates{" "}
                {chat?.scope == "private"
                  ? "cannot access"
                  : chat?.scope == "public"
                  ? "can edit"
                  : "can only view"}
              </Text>
            </Stack>
          </Group>
          <SegmentedControl
            disabled={!isAllowed}
            orientation={isMobile ? "vertical" : "horizontal"}
            value={chat?.scope}
            onChange={(value) => {
              if (chat.parentFolder) {
                updateChatAccess(chat?._id, {
                  scope: value,
                  parentFolder: null,
                }).then((res) => {
                  setChat(res.chat);
                });
              } else {
                updateChatAccess(chat?._id, {
                  scope: value,
                }).then((res) => {
                  setChat(res.chat);
                });
              }
            }}
            fullWidth
            style={{ flexGrow: 1 }}
            data={[
              {
                value: "private",
                label: (
                  <Center style={{ gap: 10 }}>
                    <Text size="sm">Private</Text>
                  </Center>
                ),
              },
              {
                value: "viewOnly",
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconBuilding size={16} />
                    <Text size="sm">View Only</Text>
                  </Center>
                ),
              },
              {
                value: "public",
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconBuilding size={16} />
                    <Text size="sm">Public</Text>
                  </Center>
                ),
              },
            ]}
          />
        </Group>
        <Divider />
        <MembersTable
          members={members}
          chat={chat}
          setChat={setChat}
          isAllowed={isAllowed}
          isMobile={isMobile}
        />
      </Stack>
    </Modal>
  );
};

const MembersTable = (props: {
  members: any[];
  chat: IChatDocument;
  setChat: (value: IChatDocument) => void;
  isAllowed: boolean;
  isMobile?: boolean;
}) => {
  const { members, chat, setChat, isAllowed, isMobile } = props;

  return (
    <ScrollArea.Autosize mah={"35vh"} offsetScrollbars={true}>
      <Table
        withColumnBorders={false}
        withRowBorders={true}
        withTableBorder={false}
        layout="auto"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={isMobile ? "50%" : "70%"}>MEMBERS</Table.Th>
            <Table.Th>ACCESS</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {members.map((member: any, index: number) => (
            <Table.Tr key={index}>
              <Table.Td>{User(member)}</Table.Td>
              <Table.Td>
                <NativeSelect
                  miw="120px"
                  disabled={!isAllowed}
                  value={
                    chat?.memberAccess?.find((m) => m.userId === member.userId)
                      ?.access
                  }
                  onChange={(e) => {
                    updateChatAccess(chat?._id, {
                      memberAccess: [
                        ...chat?.memberAccess.filter(
                          (m) => m.userId !== member.userId
                        ),
                        {
                          userId: member.userId,
                          access: e.currentTarget.value,
                        },
                      ],
                    }).then((res) => {
                      setChat(res.chat);
                    });
                  }}
                >
                  <option value="inherit">
                    {(() => {
                      switch (chat?.scope) {
                        case "private":
                          return "Inherit (No Access)";
                        case "public":
                          return "Inherit (Can view)";
                        case "viewOnly":
                          return "Inherit (Can edit";
                        default:
                          return "Inherit";
                      }
                    })()}
                  </option>
                  <option value="view">Can view</option>
                  <option value="edit">Can edit</option>
                </NativeSelect>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea.Autosize>
  );
};

const User = (member: any) => (
  <Group>
    <Avatar
      src={member?.imageUrl}
      style={{ margin: "0.3rem" }}
      color="var(--mantine-primary-color-filled)"
      radius="sm"
    ></Avatar>
    <Stack gap={1} w="calc(min(40vw, 70%))">
      <Text fw={600} size="sm" truncate="end">
        {member?.firstName + " " + member?.lastName}
      </Text>
      <Text size="sm" truncate>
        {member?.identifier}
      </Text>
    </Stack>
  </Group>
);

export default ShareChatModal;
