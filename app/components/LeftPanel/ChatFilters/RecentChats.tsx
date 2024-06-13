// Modules
import { useEffect, useState } from "react";

// Components
import { getAllChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import ChatItem from "../Items/ChatItem";
import { useAuth } from "@clerk/nextjs";
import { ScrollArea, Loader, Text } from "@mantine/core";
import { socket } from "@/socket";

const RecentChats = (props: {
  toggleLeft: () => void;
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
}) => {
  const { toggleLeft, members, allowPersonal, allowPublic } = props;
  const { userId, orgId } = useAuth();
  useEffect(() => {
    const fetchAllChats = async () => {
      const allChats = (await getAllChats(userId || "", orgId || "")).chats;
      allChats.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setRecentChats(allChats);
    };
    fetchAllChats();
    socket.on("refreshChats", () => {
      fetchAllChats();
    });

    return () => {
      console.log("unmounting recent chats");
      socket.off("refreshChats");
    };
  }, []);

  const [recentChats, setRecentChats] = useState<IChatDocument[] | null>(null);

  return (
    <ScrollArea mah="calc(100vh - 330px)" scrollbarSize={10} offsetScrollbars>
      {recentChats ? (
        recentChats.length === 0 ? (
          <Text style={{ textAlign: "center" }} c="dimmed" size="xs">
            No recent chats
          </Text>
        ) : (
          recentChats.map((chat, key) => {
            return (
              <ChatItem
                toggleLeft={toggleLeft}
                item={chat}
                key={key}
                members={members}
                allowPersonal={allowPersonal}
                allowPublic={allowPublic}
              />
            );
          })
        )
      ) : (
        <Loader type="dots" w={"100%"} />
      )}
    </ScrollArea>
  );
};

export default RecentChats;
