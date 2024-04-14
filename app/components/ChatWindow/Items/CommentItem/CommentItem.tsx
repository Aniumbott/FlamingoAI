import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Paper,
  Text,
  TextInput,
  Textarea,
  Title,
  rem,
  Stack,
  Button,
} from "@mantine/core";
import {
  IconCheck,
  IconChevronDown,
  IconCircleCheck,
  IconDots,
  IconEdit,
  IconSend,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";

import { useEffect, useState } from "react";
import ReplyItem from "../ReplyItem";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/app/controllers/comment";
import { usePathname } from "next/navigation";

import { MentionsInput, Mention } from "react-mentions";
import { set } from "mongoose";
import MentionInput, {
  MentionParser,
} from "./MentionInput";

function CommentItem(props: { comment: any; participants: any[] }) {
  const { comment, participants } = props;
  const [isOpen, setIsOpen] = useState(false);
  // const [participants, setParticipants] = useState<any>([]);
  const { user } = useUser();
  const [chatId, setChatId] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [commentText, setCommentText] = useState(comment.content.toString());
  const [isEdit, setIsEdit] = useState(false);
  const [createdBy, setCreatedBy] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    setChatId(pathname?.split("/")[3] || "");
  }, [pathname]);

  useEffect(() => {
    const getCreatedBy = participants.find((participant) => {
      return participant.userId === comment.createdBy;
    });
    setCreatedBy(getCreatedBy);
  }, [participants]);

  return (
    <Paper withBorder w="100%" p="sm" mt="1rem">
      <div className="flex flex-row ">
        {createdBy?.hasImage ? (
          <Avatar
            size="md"
            radius="sm"
            mr="sm"
            src={createdBy?.imageUrl}
            mt={5}
          />
        ) : (
          <Avatar size="md" radius="sm" mt={5} mr="sm">
            {createdBy?.firstName + createdBy?.lastName}
          </Avatar>
        )}
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center">
              <Text size="sm" fw={700} mr="sm">
                {createdBy?.firstName + " " + createdBy?.lastName ||
                  "Unknown User"}
              </Text>
              <Text size="xs">
                {new Date(comment.createdAt).toLocaleDateString() || "now"}
              </Text>
            </div>
            <div className="flex flex-row">
              <ActionIcon
                color={comment.status == "resolved" ? "teal" : "grey"}
                variant="subtle"
                onClick={() => {
                  updateComment(chatId, {
                    id: comment._id,
                    status:
                      comment.status == "resolved" ? "unresolved" : "resolved",
                  });
                }}
              >
                <IconCircleCheck style={{ width: rem(16) }} />
              </ActionIcon>
              <ActionIcon
                color="grey"
                variant="subtle"
                onClick={() => setIsOpen(!isOpen)}
              >
                <IconChevronDown
                  style={{
                    width: rem(16),
                    rotate: `${isOpen ? "180deg" : "0deg"}`,
                  }}
                />
              </ActionIcon>

              <Menu
                position="bottom-end"
                width={100}
                styles={{
                  dropdown: {
                    backgroundColor: "#ffffff",
                  },
                  item: {
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    hover: {
                      backgroundColor: "#000000",
                    },
                    height: "auto",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    padding: "0px",
                  },
                }}
              >
                <Menu.Target>
                  <ActionIcon color="grey" variant="subtle">
                    <IconDots style={{ width: rem(16) }} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {
                      setIsEdit(!isEdit);
                    }}
                  >
                    <MenuButton properties={CommentMenuData[0]} />
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      deleteComment(chatId, comment);
                    }}
                  >
                    <MenuButton properties={CommentMenuData[1]} />
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>

          {isOpen && (
            <>
              <div className="flex flex-col w-full mt-1">
                {isEdit ? (
                  <div className="w-full flex flex-row items-center mt-3">
                    {/* <TextInput
                      w="100%"
                      defaultValue={comment.content}
                      onChange={(e) => setCommentText(e.currentTarget.value)}
                    /> */}
                    <MentionInput
                      commentText={commentText}
                      setCommentText={setCommentText}
                      participants={participants}
                    />
                    <div className="h-full flex flex-col ml-2 items-center justify-center">
                      <ActionIcon
                        color="teal"
                        size="lg"
                        variant="light"
                        onClick={() => {
                          updateComment(chatId, {
                            id: comment._id,
                            content: commentText,
                          });
                          setIsEdit(!isEdit);
                        }}
                      >
                        <IconCheck size="18px" />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        mt={5}
                        size="lg"
                        variant="light"
                        onClick={() => setIsEdit(!isEdit)}
                      >
                        <IconX size="18px" />
                      </ActionIcon>
                    </div>
                  </div>
                ) : (
                  MentionParser(comment.content)
                )}
              </div>
              <Text size="xs" mt="lg">
                Reply
              </Text>
              <div className="flex flex-col">
                {comment?.replies &&
                  comment.replies.map((reply: any, id: any) => (
                    <ReplyItem
                      key={id}
                      reply={reply}
                      participants={participants}
                    />
                  ))}
              </div>
              {/* <Textarea
                  mt="md"
                  placeholder="Reply to comment"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.currentTarget.value)}
                  rightSection={
                    <ActionIcon
                      color="grey"
                      mr="1rem"
                      onClick={(e) =>
                        addReply(
                          user?.id || "",
                          replyContent,
                          comment.messageId
                        ).then((res) => {
                          updateComment(chatId, {
                            id: comment._id,
                            replies: [...comment.replies, res.comment._id],
                          });
                          setReplyContent("");
                        })
                      }
                    >
                      <IconSend style={{ width: rem(16) }} />
                    </ActionIcon>
                  }
                ></Textarea> */}
              <div className="relative mt-4">
                <MentionInput
                  commentText={replyContent}
                  setCommentText={setReplyContent}
                  participants={participants}
                />
                <ActionIcon
                  color="grey"
                  mr="1rem"
                  onClick={(e) =>
                    createComment(
                      user?.id || "",
                      replyContent,
                      comment.messageId,
                      chatId,
                      comment._id
                    ).then(() => {
                      setReplyContent("");
                    })
                  }
                  style={{
                    position: "absolute",
                    right: "0",
                    bottom: "1rem",
                  }}
                >
                  <IconSend style={{ width: rem(16) }} />
                </ActionIcon>
              </div>
            </>
          )}
        </div>
      </div>
    </Paper>
  );
}

const MenuButton = (props: {
  properties: { title: string; icon: React.ReactNode };
}) => {
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Button
        leftSection={props.properties.icon}
        fullWidth
        {...(hovered
          ? { color: "green", variant: "outline", fz: "xl" }
          : { color: "0F172A", variant: "transparent" })}
        justify="flex-start"
        styles={{
          root: {
            padding: "6px",
            height: "auto",
          },
        }}
      >
        <Stack gap={1} align="start">
          <Text fw={"400"} fz={"xs"}>
            {props.properties.title}
          </Text>
        </Stack>
      </Button>
    </div>
  );
};

const CommentMenuData: any = [
  {
    title: "Edit",
    icon: <IconEdit style={{ width: rem(14), height: rem(14) }} />,
  },
  {
    title: "Delete",
    icon: <IconTrash style={{ width: rem(14), height: rem(14) }} />,
  },
];

export default CommentItem;
