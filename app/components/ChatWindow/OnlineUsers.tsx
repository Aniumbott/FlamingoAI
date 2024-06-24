import { socket } from "@/socket";
import {
  Avatar,
  Divider,
  Group,
  HoverCard,
  List,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";

export default function OnlineUsers(props: {
  participants: any[];
  chatId: String;
}) {
  const { participants, chatId } = props;
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    setOnlineUsers([]);
    socket.on("onlineUsers", (users: String[]) => {
      setOnlineUsers(users);
      //   console.log(users);
    });
    return () => {
      socket.off("onlineUsers");
    };
  }, [chatId]);

  return (
    <HoverCard withArrow>
      <HoverCard.Target>
        <Avatar.Group>
          {participants.map((member: any, key: number) =>
            onlineUsers.includes(member.userId) ? (
              onlineUsers.length <= 2 ? (
                member?.hasImage ? (
                  <Avatar key={key} size="sm" src={member.imageUrl} />
                ) : (
                  <Avatar key={key} size="sm" variant="white">
                    {member?.firstName[0] + member?.lastName[0]}
                  </Avatar>
                )
              ) : (
                <>
                  {member.hasImage ? (
                    <Avatar radius="sm" size="sm" src={member.imageUrl} />
                  ) : (
                    <Avatar size="sm" variant="white">
                      {member.firstName[0] + member.lastName[0]}
                    </Avatar>
                  )}
                  {member.hasImage ? (
                    <Avatar radius="sm" size="sm" src={member.imageUrl} />
                  ) : (
                    <Avatar size="sm" variant="white">
                      {member.firstName[0] + member.lastName[0]}
                    </Avatar>
                  )}
                  <Avatar size="sm" variant="white">
                    +{onlineUsers.length - 2}
                  </Avatar>
                </>
              )
            ) : null
          )}
        </Avatar.Group>
      </HoverCard.Target>
      <HoverCard.Dropdown py={0} px="sm">
        <Text fw={700} c="dimmed" my="sm">
          {onlineUsers.length} {onlineUsers.length === 1 ? "user" : "users"}{" "}
          online
        </Text>
        <ScrollArea
          mah={300}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {participants.map((member: any, key: number) =>
            onlineUsers.includes(member.userId) ? (
              <>
                <Group key={member.userId} mb={10}>
                  {member.hasImage ? (
                    <Avatar size="sm" src={member.imageUrl} />
                  ) : (
                    <Avatar size="sm">
                      {member.firstName[0] + member.lastName[0]}
                    </Avatar>
                  )}
                  <Text size="sm">
                    {member.firstName + " " + member.lastName}
                  </Text>
                </Group>
              </>
            ) : null
          )}
        </ScrollArea>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
