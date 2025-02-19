import {
  Button,
  CloseButton,
  Divider,
  Group,
  ScrollArea,
  Text,
  Title,
  Select,
  Tooltip,
} from "@mantine/core";
import style from ".././RightPanel.module.css";
import { useEffect, useState } from "react";
import { IconAt, IconCircleDot } from "@tabler/icons-react";
import { IconCircleCheck } from "@tabler/icons-react";
import { getChat } from "@/app/controllers/chat";
import { useOrganization, useUser } from "@clerk/nextjs";
import { ICommentDocument } from "@/app/models/Comment";
import { usePathname } from "next/navigation";
import CommentItem from "@/app/components/ChatWindow/Items/CommentItem/CommentItem";
import { useToggle } from "@mantine/hooks";
import { comment } from "postcss";
import { socket } from "@/socket";
import { getMessages } from "@/app/controllers/message";

export default function CommentsPanel(props: { toggleRight: () => void }) {
  const { toggleRight } = props;
  const [filter, setFilter] = useState("all");
  const [isMentions, setIsMentions] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const { organization } = useOrganization();
  const { user } = useUser();
  const [chatId, setChatId] = useState<any>(null);
  const [participants, setParticipants] = useState<any>([]);
  const pathname = usePathname();
  useEffect(() => {
    if (chatId) {
      setComments([]);
      getMessages(chatId).then((res) => {
        console.log(res.messages);
        res.messages.forEach((message: any) => {
          setComments((comments) => [...comments, ...message.comments]);
        });
      });
    }
  }, [chatId]);

  useEffect(() => {
    socket.on("newCommentInSection", (comment: ICommentDocument) => {
      if (comment.parent) {
        const parentComment = comments.find((c) => c._id == comment.parent);
        parentComment.replies.push(comment);
        setComments(
          comments.map((c) => {
            if (c._id == parentComment._id) return parentComment;
            return c;
          })
        );
      } else {
        setComments([...comments, comment]);
      }
    });

    socket.on("updateCommentInSection", (comment: ICommentDocument) => {
      setComments(
        comments.map((c: any) => {
          if (c._id == comment._id) return comment;
          return c;
        })
      );
    });

    socket.on("deleteCommentInSection", (comment: ICommentDocument) => {
      if (comment.parent) {
        const parentComment = comments.find((c) => c._id == comment.parent);
        parentComment.replies = parentComment.replies.filter(
          (c: any) => c._id != comment._id
        );
        setComments(
          comments.map((c) => {
            if (c._id == parentComment._id) return parentComment;
            return c;
          })
        );
      } else {
        setComments(comments.filter((c) => c._id != comment._id));
      }
    });

    return () => {
      socket.off("newCommentInSection");
      socket.off("updateCommentInSection");
      socket.off("deleteCommentInSection");
    };
  }, [comments]);

  useEffect(() => {
    setChatId(pathname?.split("/")[3]);
  }, [pathname]);

  // useEffect(() => {
  //   console.log("comment", comment);
  // }, [comment]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const res =
        (await organization?.getMemberships())?.map(
          (member: any) => member.publicUserData
        ) || [];
      setParticipants(res);
    };
    fetchParticipants();
  }, [organization?.membersCount]);

  function haveMentioned(comment: any, id: String) {
    if (comment.content.includes(id)) {
      return true;
    }
    for (let i = 0; i < comment.replies.length; i++) {
      if (comment.replies[i].content.includes(id)) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="mx-2">
      <div className={style.activeTitle}>
        <Text>COMMENTS</Text>
        <Tooltip label="Close" position="left" fz="xs">
          <CloseButton onClick={toggleRight} />
        </Tooltip>
      </div>
      <Divider my="md" />
      <div className="flex flex-row justify-between">
        <Select
          // variant="filled"
          w="48%"
          radius="md"
          value={filter}
          onChange={(value) => setFilter(value || "all")}
          data={[
            { value: "all", label: "All" },
            { value: "resolved", label: "Resolved" },
            { value: "unresolved", label: "Unresolved" },
          ]}
        ></Select>

        <Button
          leftSection={<IconAt size="16px" />}
          size="sm"
          radius="md"
          w="48%"
          {...(isMentions
            ? {
                variant: "filled",
              }
            : {
                variant: "default",
              })}
          onClick={() => setIsMentions(!isMentions)}
        >
          <Text size="xs" fw={700}>
            Mentions
          </Text>
        </Button>
      </div>

      <div className="mt-3 h-full">
        {!chatId ? (
          // <div className="w-full h-full flex justify-center items-center">
          <Text mt="xl" size="xs" c="dimmed" ta="center">
            Select a chat
          </Text>
        ) : // </div>
        null}
        <ScrollArea h="85vh" scrollbarSize={0}>
          {[
            filter == "unresolved"
              ? comments.filter((comment) => comment.status == "unresolved")
              : filter == "resolved"
              ? comments.filter((comment) => comment.status == "resolved")
              : comments,
          ]
            .flat()
            .map((comment, i) =>
              isMentions ? (
                haveMentioned(comment, user?.id || "") ? (
                  <CommentItem
                    userId={user?.id || ""}
                    key={i}
                    comment={comment}
                    participants={participants}
                  />
                ) : null
              ) : (
                <CommentItem
                  userId={user?.id || ""}
                  key={i}
                  comment={comment}
                  participants={participants}
                />
              )
            )}
        </ScrollArea>
      </div>
    </div>
  );
}
