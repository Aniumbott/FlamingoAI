// Modules
import { updateMessage } from "@/app/controllers/message";
import {
  ActionIcon,
  Avatar,
  Box,
  CopyButton,
  Text,
  TextInput,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import {
  IconArrowFork,
  IconBookmarkPlus,
  IconCheck,
  IconCopy,
  IconEdit,
  IconMessages,
  IconRobotFace,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

function getDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function MessageItem(props: {
  message: {
    _id: string;
    createdBy: {
      hasImage: Boolean;
      name: String;
      avatar: string;
    };
    content: String;
    type: String;
    updatedAt: Date;
    createdAt: Date;
  };
}) {
  const { message } = props;
  const { colorScheme } = useMantineColorScheme();
  const { hovered, ref } = useHover();
  const [messageText, setMessageText] = useState(message.content || "");
  const [isEdit, setIsEdit] = useState(false);
  return (
    <Box ref={ref}>
      <div
        className="w-full  py-10 flex justify-center items-start"
        style={{
          background:
            colorScheme == "dark"
              ? "var(--mantine-color-dark-8)"
              : "var(--mantine-color-gray-0)",
        }}
      >
        <div className="w-2/3 h-full min-w-96 flex flex-row ">
          <div className="flex flex-col ">
            {message.type === "user" ? (
              message.createdBy.hasImage ? (
                <Avatar
                  size="md"
                  radius="sm"
                  src={message.createdBy.avatar}
                  mt={5}
                />
              ) : (
                <Avatar size="md" radius="sm" mt={5}>
                  {message.createdBy.name[0]}
                </Avatar>
              )
            ) : (
              <Avatar size="md" radius="sm" mt={5}>
                <IconRobotFace
                  size="24px"
                  color="var(--mantine-color-teal-3)"
                />
              </Avatar>
            )}
            {hovered && !isEdit && (
              <ActionIcon color="grey" variant="subtle" mt="1rem">
                <IconArrowFork style={{ width: rem(24), rotate: "180deg" }} />
              </ActionIcon>
            )}
          </div>
          <div className="w-full ml-10 flex flex-col   ">
            <div className="flex flex-row justify-between ">
              <div className="flex flex-row items-center ">
                <Text size="md" fw={700}>
                  {message.type == "user" ? message.createdBy.name : "TeamGPT"}
                </Text>
                <Text pl={10} size="xs">
                  {getDate(message.updatedAt.toString())}
                </Text>
                {message.createdAt !== message.updatedAt ? (
                  <Text pl={10} size="xs">
                    (edited)
                  </Text>
                ) : null}
              </div>

              <div className="flex flex-row">
                {hovered && !isEdit ? (
                  message.type === "user" ? (
                    <>
                      <ActionIcon color="grey" variant="subtle">
                        <IconEdit
                          display={isEdit ? "none" : "block"}
                          style={{ width: rem(16) }}
                          onClick={() => setIsEdit(!isEdit)}
                        />
                      </ActionIcon>
                      <ActionIcon color="grey" variant="subtle">
                        <IconBookmarkPlus style={{ width: rem(16) }} />
                      </ActionIcon>
                      <ActionIcon color="grey" variant="subtle">
                        <IconTrash style={{ width: rem(16) }} />
                      </ActionIcon>
                    </>
                  ) : (
                    <ActionIcon color="grey" variant="subtle">
                      <IconTrash style={{ width: rem(16) }} />
                    </ActionIcon>
                  )
                ) : null}
              </div>
            </div>
            {isEdit ? (
              <div className="w-full flex flex-row items-center justify-center mt-3">
                <TextInput
                  w="100%"
                  value={messageText.toString()}
                  onChange={(e) => setMessageText(e.currentTarget.value)}
                />
                <ActionIcon color="teal" ml="1rem" size="lg">
                  <IconCheck
                    size="18px"
                    onClick={() => {
                      if (
                        confirm(
                          "All messages sent after the one you are about to edit will be deleted!"
                        ).valueOf()
                      ) {
                        const newMessage = { ...message, content: messageText };
                        console.log(newMessage);
                      }

                      // const update = async () =>
                      //   await updateMessage(message._id, newMessage);
                      // update().then(() => setIsEdit(false));
                    }}
                  />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  ml="0.5rem"
                  size="lg"
                  onClick={() => setIsEdit(!isEdit)}
                >
                  <IconX size="18px" />
                </ActionIcon>
              </div>
            ) : (
              <Text size="md">{messageText}</Text>
            )}
            <div className="flex flex-row mt-2">
              <CopyButton value={String(message.content)} timeout={2000}>
                {({ copied, copy }) => (
                  <ActionIcon
                    color={copied ? "teal" : "gray"}
                    variant="subtle"
                    onClick={copy}
                  >
                    {copied ? (
                      <IconCheck style={{ width: rem(16) }} />
                    ) : (
                      <IconCopy style={{ width: rem(16) }} />
                    )}
                  </ActionIcon>
                )}
              </CopyButton>
              <ActionIcon color="grey" variant="subtle">
                <IconMessages style={{ width: rem(16) }} />
              </ActionIcon>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default MessageItem;
