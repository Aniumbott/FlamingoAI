// Modules
import { useEffect, useState } from "react";

// Components
import { getAllChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import ChatItem from "../Items/ChatItem";
import { useAuth } from "@clerk/nextjs";
import { ScrollArea, Loader } from "@mantine/core";
import { socket } from "@/socket";

const RecentChats = (props: {
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
}) => {
  const { members, allowPersonal, allowPublic } = props;
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

  const [recentChats, setRecentChats] = useState<IChatDocument[]>([]);

  return (
    <div>
      <ScrollArea h="50vh" scrollbarSize={10} offsetScrollbars>
        {recentChats.length > 0 ? (
          recentChats.map((chat, key) => {
            return (
              <ChatItem
                item={chat}
                key={key}
                members={members}
                allowPersonal={allowPersonal}
                allowPublic={allowPublic}
              />
            );
          })
        ) : (
          <Loader type="dots" w={"100%"} color="teal" />
        )}
      </ScrollArea>
    </div>
  );
};

export default RecentChats;
