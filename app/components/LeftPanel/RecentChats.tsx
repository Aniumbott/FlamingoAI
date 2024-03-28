// Modules
import { useEffect, useState } from "react";

// Components
import { getAllChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import ChatItem from "./ChatItem";

const RecentChats = () => {
  useEffect(() => {
    const fetchAllChats = async () => {
      const allChats = (await getAllChats()).chats;
      allChats.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setRecentChats(allChats);
    };
    fetchAllChats();
    console.log("recentChats", recentChats);
  }, []);

  const [recentChats, setRecentChats] = useState<IChatDocument[]>([]);

  return (
    <div>
      {recentChats.map((chat, key) => {
        return <ChatItem item={chat} key={key} />;
      })}
    </div>
  );
};

export default RecentChats;
