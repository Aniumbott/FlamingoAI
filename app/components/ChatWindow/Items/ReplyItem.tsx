import { deleteComment } from "@/app/controllers/comment";
import { Avatar, Card, Title, Text, ActionIcon, rem } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MentionParser } from "./CommentItem/MentionInput";

export default function ReplyItem(props: { reply: any; participants: any[] }) {
  const { reply, participants } = props;
  const pathname = usePathname();
  const [chatId, setChatId] = useState("");
  const [createdBy, setCreatedBy] = useState<any>(null);

  useEffect(() => {
    setChatId(pathname?.split("/")[3] || "");
  }, [pathname]);

  useEffect(() => {
    const getCreatedBy = participants.find((participant) => {
      return participant.userId === reply.createdBy;
    });
    setCreatedBy(getCreatedBy);
  }, [participants]);

  return (
    <Card mt="md" p="sm">
      <div className="flex flex-row w-full">
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
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-fill flex flex-rwo">
              <Text size="sm" fw={700} mr="sm">
                {createdBy?.firstName + " " + createdBy?.lastName ||
                  "Unknown User"}
              </Text>
              <Text size="xs">
                {new Date(reply.createdAt).toLocaleDateString() || "now"}
              </Text>
            </div>
            <ActionIcon
              color="grey"
              variant="subtle"
              onClick={() => {
                deleteComment(chatId, reply);
              }}
            >
              <IconTrash style={{ width: rem(16) }} />
            </ActionIcon>
          </div>
          {MentionParser(reply.content)}
        </div>
      </div>
    </Card>
  );
}
