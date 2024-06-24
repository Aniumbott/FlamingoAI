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
  Tooltip,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useHover, useMediaQuery } from "@mantine/hooks";
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
import CommentItem from "../CommentItem/CommentItem";
import { useOrganization, useUser } from "@clerk/nextjs";
import MentionInput from "../CommentItem/MentionInput";
import { MessageRender } from "./MessageRenderer";

function getDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function MessageItem(props: {
  message: any;
  participants: any[];
  userId: string;
  orgId: string;
  instructions: any;
  assistant: any;
  setPromptOpened: (value: boolean) => void;
  setPromptContent: (value: string) => void;
  setForkMessage: (value: any) => void;
  setIsForkModalOpen: (value: boolean) => void;
}) {
  const {
    message,
    participants,
    userId,
    orgId,
    instructions,
    assistant,
    setPromptOpened,
    setPromptContent,
    setForkMessage,
    setIsForkModalOpen,
  } = props;
  const { colorScheme } = useMantineColorScheme();
  const { hovered, ref } = useHover();
  const [messageText, setMessageText] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [createdBy, setCreatedBy] = useState<any>(null);
  const isMobile = useMediaQuery(`(max-width: 48em)`);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const getCreatedBy = participants.find((participant) => {
      return participant.userId === message.createdBy;
    });
    if (getCreatedBy) {
      setCreatedBy(getCreatedBy);
    }
  }, [participants]);

  useEffect(() => {
    const user = participants.find(
      (participant) => participant.userId === userId
    );
    if (user) {
      setIsAllowed(
        user.userId === message.createdBy || user.role === "org:admin"
      );
    }
  }, [participants]);

  useEffect(() => {
    setMessageText(message.content);
  }, [message]);

  return (
    <Box ref={ref} mx={!isMobile ? "md" : ""} w="100%">
      <div
        className={`w-full flex justify-center items-start ${
          isMobile ? "py-5" : "py-10"
        }`}
        style={{
          background:
            colorScheme === "dark"
              ? "var(--mantine-color-dark-6)"
              : "var(--mantine-color-white)",
          borderRadius: isMobile ? "0" : "var(--mantine-radius-md)",
        }}
      >
        <div className="w-full h-full max-w-[1000px] gap-2.5 px-2.5 flex flex-row overflow-y-scroll">
          {!isMobile && (
            <div className="flex flex-col">
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
                    color="var(--mantine-primary-color-3)"
                  />
                </Avatar>
              )}
              {(hovered || isMobile) && !isEdit ? (
                <Tooltip label="Fork Chat" fz="xs" position="bottom">
                  <ActionIcon
                    color="grey"
                    variant="subtle"
                    mt="1rem"
                    onClick={() => {
                      setForkMessage(message);
                      setIsForkModalOpen(true);
                    }}
                  >
                    <IconArrowFork
                      style={{ width: rem(24), rotate: "180deg" }}
                    />
                  </ActionIcon>
                </Tooltip>
              ) : null}
            </div>
          )}
          <div
            className="w-full flex flex-col"
            style={
              {
                // marginLeft: "calc(min(3vw, 2rem))",
              }
            }
          >
            <div className="flex flex-row justify-between items-center min-h-8">
              <div className="flex flex-row items-center">
                {isMobile && (
                  <div className="flex items-center justify-center gap-1 mr-2">
                    {message.type === "user" ? (
                      createdBy?.hasImage ? (
                        <Avatar
                          size="sm"
                          radius="sm"
                          src={createdBy?.imageUrl}
                        />
                      ) : (
                        <Avatar size="sm" radius="sm">
                          {createdBy?.firstName + createdBy?.lastName}
                        </Avatar>
                      )
                    ) : (
                      <Avatar size="sm" radius="sm">
                        <IconRobotFace
                          size="20px"
                          color="var(--mantine-primary-color-3)"
                        />
                      </Avatar>
                    )}
                  </div>
                )}
                <Text size="md" fw={700}>
                  {message.type === "user"
                    ? `${createdBy?.firstName || ""} ${
                        createdBy?.lastName || ""
                      }`
                    : "TeamGPT"}
                </Text>
                <Text pl={10} size="xs">
                  {getDate(message.updatedAt.toString())}
                </Text>
              </div>

              <div className="flex flex-row gap-[1px] items-center">
                {isMobile && !isEdit ? (
                  <Tooltip label="Fork Chat" fz="xs" position="bottom">
                    <ActionIcon
                      size={"sm"}
                      color="grey"
                      variant="subtle"
                      onClick={() => {
                        setForkMessage(message);
                        setIsForkModalOpen(true);
                      }}
                    >
                      <IconArrowFork
                        style={{ width: rem(24), rotate: "180deg" }}
                      />
                    </ActionIcon>
                  </Tooltip>
                ) : null}
                {(hovered || isMobile) && !isEdit ? (
                  message.type === "user" ? (
                    <>
                      {createdBy?.userId === userId ? (
                        <Tooltip label="Edit" fz="xs">
                          <ActionIcon
                            color="grey"
                            variant="subtle"
                            display={isEdit ? "none" : "block"}
                            onClick={() => setIsEdit(!isEdit)}
                          >
                            <IconEdit style={{ width: rem(16) }} />
                          </ActionIcon>
                        </Tooltip>
                      ) : null}

                      <Tooltip label="Save prompt" fz="xs">
                        <ActionIcon color="grey" variant="subtle">
                          <IconBookmarkPlus
                            style={{ width: rem(16) }}
                            onClick={() => {
                              setPromptContent(message.content);
                              setPromptOpened(true);
                            }}
                          />
                        </ActionIcon>
                      </Tooltip>
                      {isAllowed ? (
                        <Tooltip label="Delete" fz="xs">
                          <ActionIcon
                            color="grey"
                            variant="subtle"
                            onClick={() => {
                              deleteMessage(message);
                            }}
                          >
                            <IconTrash style={{ width: rem(16) }} />
                          </ActionIcon>
                        </Tooltip>
                      ) : null}
                    </>
                  ) : (
                    <Tooltip label="Delete" fz="xs">
                      <ActionIcon
                        color="grey"
                        variant="subtle"
                        onClick={() => {
                          deleteMessage(message);
                        }}
                      >
                        <IconTrash style={{ width: rem(16) }} />
                      </ActionIcon>
                    </Tooltip>
                  )
                ) : null}
              </div>
            </div>
            {isEdit ? (
              <div className="w-full flex flex-row items-center justify-center mt-3">
                <TextInput
                  w="100%"
                  defaultValue={messageText}
                  onChange={(e) => {
                    setMessageText(e.currentTarget.value);
                  }}
                />
                <Tooltip label="Save" fz="xs">
                  <ActionIcon
                    ml="1rem"
                    size="lg"
                    variant="light"
                    onClick={() => {
                      console.log(messageText);
                      if (
                        confirm(
                          "All messages sent after the one you are about to edit will be deleted!"
                        ).valueOf()
                      ) {
                        let msg = message;
                        msg.content = messageText;
                        msg.createdBy = createdBy?.userId;

                        console.log("msg", msg);
                        updateMessageContent(msg)
                          .then((res) => {
                            sendAssistantMessage(
                              [],
                              msg,
                              instructions,
                              orgId || "",
                              assistant
                            );
                          })
                          .then(() => {
                            setIsEdit(!isEdit);
                          });
                        setMessageText("");
                      }
                    }}
                  >
                    <IconCheck size="18px" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Cancel" fz="xs">
                  <ActionIcon
                    color="red"
                    ml="0.5rem"
                    size="lg"
                    variant="light"
                    onClick={() => setIsEdit(!isEdit)}
                  >
                    <IconX size="18px" />
                  </ActionIcon>
                </Tooltip>
              </div>
            ) : (
              // <Text size="md">{message.content}</Text>
              <MessageRender>{message.content}</MessageRender>
            )}
            <div className="flex flex-row mt-2">
              <CopyButton value={String(message.content)} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Copied message" : "Copy message text"}
                    fz="xs"
                    position="bottom"
                  >
                    <ActionIcon
                      color={!copied ? "grey" : ""}
                      variant="subtle"
                      onClick={copy}
                    >
                      {copied ? (
                        <IconCheck style={{ width: rem(16) }} />
                      ) : (
                        <IconCopy style={{ width: rem(16) }} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
              <Tooltip label="Show comments" fz="xs" position="bottom">
                <ActionIcon
                  color={showComments ? "" : "grey"}
                  variant="subtle"
                  onClick={() => {
                    setShowComments(!showComments);
                  }}
                >
                  <IconMessages style={{ width: rem(16) }} />
                </ActionIcon>
              </Tooltip>
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
                        userId={userId}
                      />
                    );
                  })}

                  <div className="relative mt-4">
                    <MentionInput
                      commentText={commentInput}
                      setCommentText={setCommentInput}
                      participants={participants}
                    />
                    <Tooltip label="Add a comment" fz="xs">
                      <ActionIcon
                        color="grey"
                        mr="1rem"
                        onClick={() => {
                          createComment(
                            String(userId),
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
                    </Tooltip>
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
