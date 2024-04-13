import React, { useState, useEffect } from "react";
import {
  ActionIcon,
  Avatar,
  Button,
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
} from "@mantine/core";
import { IconBuilding, IconCheck, IconCopy } from "@tabler/icons-react";
import { Organization } from "@clerk/nextjs/server";
import { useOrganization } from "@clerk/nextjs";
import { IChatDocument } from "../models/Chat";
import { usePathname } from "next/navigation";
import { updateChat } from "../controllers/chat";
import { access } from "fs";

const ShareChatModal = (props: {
  opened: boolean;
  setOpened: (value: boolean) => void;
  chat: IChatDocument;
  setChat: (value: IChatDocument) => void;
  members: any[];
}) => {
  const { opened, setOpened, chat, setChat, members } = props;
  const [scope, setScope] = useState(chat?.scope);
  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
      }}
      padding={20}
      size={"80%"}
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
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        variant="filled"
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
        <Group gap={50}>
          <Group gap={10}>
            <ActionIcon color={"gray"} variant="filled" size={36}>
              <IconBuilding size={26} />
            </ActionIcon>
            <Stack gap={3} style={{ flexGrow: 1 }}>
              <Title order={4}>Aniket Workspace</Title>
              <Text size="sm" c="gray">
                Teammates can edit
              </Text>
            </Stack>
          </Group>
          <SegmentedControl
            value={scope}
            onChange={(value) => {
              setScope;
              updateChat(chat?._id, {
                scope: value,
              }).then((res) => {
                setChat(res.chat);
              });
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
        <MembersTable members={members} chat={chat} setChat={setChat} />
      </Stack>
    </Modal>
  );
};

const MembersTable = (props: {
  members: any[];
  chat: IChatDocument;
  setChat: (value: IChatDocument) => void;
}) => {
  const { members, chat, setChat } = props;
  // const { organization } = useOrganization();
  // const [MembersData, setMembersData] = useState<any>([]);
  // useEffect(() => {
  //   const fetchParticipants = async () => {
  //     const res =
  //       (await organization?.getMemberships())?.map(
  //         (member: any) => member.publicUserData
  //       ) || [];
  //     setMembersData(res);
  //   };
  //   fetchParticipants();
  // }, [organization?.membersCount]);

  return (
    <>
      <Table
        withColumnBorders={false}
        withRowBorders={true}
        withTableBorder={false}
        layout="fixed"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ flexGrow: 1 }}>MEMBERS</Table.Th>
            <Table.Th>ACCESS</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {members.map((member: any, index: number) => (
            <Table.Tr key={index}>
              <Table.Td>{User(member)}</Table.Td>
              {/* <Table.Td>{member.dateJoined}</Table.Td> */}
              <Table.Td align="center">
                <NativeSelect
                  value={
                    chat?.memberAccess.find((m) => m.userId === member.userId)
                      ?.access
                  }
                  onChange={(e) => {
                    updateChat(chat?._id, {
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
                          return "Inherit - private";
                        case "public":
                          return "Inherit - public";
                        case "viewOnly":
                          return "Inherit - viewOnly";
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
    </>
  );
};

const User = (member: any) => (
  <Group>
    <Avatar
      src={member?.imageUrl}
      style={{ margin: "0.3rem" }}
      color="green"
      radius="sm"
    ></Avatar>
    <Stack gap={1}>
      <Text c="white" fw={600} fz={"md"}>
        {member?.firstName + " " + member?.lastName}
      </Text>
      <Text>{member?.identifier}</Text>
    </Stack>
  </Group>
);

export default ShareChatModal;
