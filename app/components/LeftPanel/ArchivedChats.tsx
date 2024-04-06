// Modules
import { useEffect, useState } from "react";

// Components
import { getArchivedChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import ChatItem from "./ChatItem";
import { useAuth } from "@clerk/nextjs";
import { ScrollArea } from "@mantine/core";
import { socket } from "@/socket";

const ArchivedChats = (props: { members: any[] }) => {
  const { members } = props;
  const { userId, orgId } = useAuth();
  useEffect(() => {
    const fetchAllChats = async () => {
      const chats = (await getArchivedChats(userId || "", orgId || "")).chats;
      console.log("archied", chats);
      setArchivedChats(chats);
    };
    fetchAllChats();
    socket.on("newChat", (chat) => {
      fetchAllChats();
    });
  }, []);

  const [archivedChats, setArchivedChats] = useState<IChatDocument[]>([]);

  return (
    <div>
      <ScrollArea h="50vh" scrollbarSize={10} offsetScrollbars>
        {archivedChats.map((chat, key) => {
          return <ChatItem item={chat} key={key} members={members} />;
        })}
      </ScrollArea>
    </div>
  );
};

export default ArchivedChats;
