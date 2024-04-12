// Modules
import { createComment } from "@/app/controllers/comment";
import {
  deleteMessage,
  sendAssistantMessage,
  updateMessageContent,
} from "@/app/controllers/message";
import {
  ActionIcon,
  Avatar,
  Box,
  CopyButton,
  Text,
  TextInput,
  Textarea,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconSend, IconX } from "@tabler/icons-react";
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
import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import { useOrganization, useUser } from "@clerk/nextjs";
import MentionInput from "./MentionInput";
import ForkChatModal from "./ForkChatModal";
import { MessageRender } from "./MessageRenderer";

function getDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function MessageItem(props: { message: any; participants: any[] }) {
  const { message, participants } = props;
  const { colorScheme } = useMantineColorScheme();
  const { hovered, ref } = useHover();
  const [messageText, setMessageText] = useState(message.content || "");
  const [isEdit, setIsEdit] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);
  const { user } = useUser();
  const [createdBy, setCreatedBy] = useState<any>(null);
  const { organization } = useOrganization();

  useEffect(() => {
    const getCreatedBy = participants.find((participant) => {
      return participant.userId === message.createdBy;
    });
    setCreatedBy(getCreatedBy);
  }, [participants]);

  return (
    <Box ref={ref}>
      <ForkChatModal
        isOpen={isForkModalOpen}
        setIsOpen={setIsForkModalOpen}
        message={message}
      />
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
              createdBy?.hasImage ? (
                <Avatar
                  size="md"
                  radius="sm"
                  src={createdBy?.imageUrl}
                  mt={5}
                />
              ) : (
                <Avatar size="md" radius="sm" mt={5}>
                  {createdBy?.firstName + createdBy?.lastName}
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
            {(hovered && !isEdit) || isForkModalOpen ? (
              <ActionIcon
                color="grey"
                variant="subtle"
                mt="1rem"
                onClick={() => setIsForkModalOpen(true)}
              >
                <IconArrowFork style={{ width: rem(24), rotate: "180deg" }} />
              </ActionIcon>
            ) : null}
          </div>
          <div className="w-full ml-10 flex flex-col   ">
            <div className="flex flex-row justify-between ">
              <div className="flex flex-row items-center ">
                <Text size="md" fw={700}>
                  {message.type == "user"
                    ? createdBy?.firstName + createdBy?.lastName
                    : "TeamGPT"}
                </Text>
                <Text pl={10} size="xs">
                  {getDate(message.updatedAt.toString())}
                </Text>
                {/* {message.createdAt !== message.updatedAt ? (
                  <Text pl={10} size="xs">
                    (edited)
                  </Text>
                ) : null} */}
              </div>

              <div className="flex flex-row">
                {hovered && !isEdit ? (
                  message.type === "user" ? (
                    <>
                      <ActionIcon
                        color="grey"
                        variant="subtle"
                        display={isEdit ? "none" : "block"}
                        onClick={() => setIsEdit(!isEdit)}
                      >
                        <IconEdit style={{ width: rem(16) }} />
                      </ActionIcon>
                      <ActionIcon color="grey" variant="subtle">
                        <IconBookmarkPlus style={{ width: rem(16) }} />
                      </ActionIcon>
                      <ActionIcon
                        color="grey"
                        variant="subtle"
                        onClick={() => {
                          deleteMessage(message);
                        }}
                      >
                        <IconTrash style={{ width: rem(16) }} />
                      </ActionIcon>
                    </>
                  ) : (
                    <ActionIcon
                      color="grey"
                      variant="subtle"
                      onClick={() => {
                        deleteMessage(message);
                      }}
                    >
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
                <ActionIcon
                  color="teal"
                  ml="1rem"
                  size="lg"
                  variant="light"
                  onClick={() => {
                    if (
                      confirm(
                        "All messages sent after the one you are about to edit will be deleted!"
                      ).valueOf()
                    ) {
                      updateMessageContent({
                        ...message,
                        creaatedBy: createdBy?.userId,
                        content: messageText,
                      })
                        .then((res) => {
                          sendAssistantMessage(
                            res.message,
                            organization?.id || "",
                            "gpt-3.5-turbo"
                          );
                        })
                        .then(() => {
                          setIsEdit(!isEdit);
                        });
                    }
                  }}
                >
                  <IconCheck size="18px" />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  ml="0.5rem"
                  size="lg"
                  variant="light"
                  onClick={() => setIsEdit(!isEdit)}
                >
                  <IconX size="18px" />
                </ActionIcon>
              </div>
            ) : (
              // <Text size="md">{message.content}</Text>
              <MessageRender>{message.content}</MessageRender>
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
              <ActionIcon
                color={showComments ? "teal" : "grey"}
                variant="subtle"
                onClick={() => {
                  setShowComments(!showComments);
                }}
              >
                <IconMessages style={{ width: rem(16) }} />
              </ActionIcon>
            </div>
            <div className="flex flex-row mt-2 w-full">
              {showComments ? (
                <div className="w-full flex flex-col ">
                  {message.comments?.map((comment: any, id: any) => {
                    return (
                      <CommentItem
                        key={id}
                        comment={comment}
                        participants={participants}
                      />
                    );
                  })}
                  {/* <Textarea
                    mt="md"
                    onChange={(e) => setCommentInput(e.currentTarget.value)}
                    placeholder="Add a comment."
                    rightSection={
                      <ActionIcon
                        color="grey"
                        mr="1rem"
                        onClick={() => {
                          createComment(
                            String(user?.id),
                            commentInput,
                            message._id,
                            message.chatId
                          );
                          setCommentInput("");
                        }}
                      >
                        <IconSend style={{ width: rem(16) }} />
                      </ActionIcon>
                    }
                  ></Textarea> */}

                  <div className="relative mt-4">
                    <MentionInput
                      commentText={commentInput}
                      setCommentText={setCommentInput}
                      participants={participants}
                    />
                    <ActionIcon
                      color="grey"
                      mr="1rem"
                      onClick={() => {
                        createComment(
                          String(user?.id),
                          commentInput,
                          message._id,
                          message.chatId,
                          null
                        );
                        setCommentInput("");
                      }}
                      style={{
                        position: "absolute",
                        right: "0",
                        bottom: "1rem",
                      }}
                    >
                      <IconSend style={{ width: rem(16) }} />
                    </ActionIcon>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default MessageItem;
