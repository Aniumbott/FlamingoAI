// Modules
import { useEffect, useState } from "react";

// Components
import { getAllChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import ChatItem from "./ChatItem";
import { useAuth } from "@clerk/nextjs";

const RecentChats = (props: { members: any[] }) => {
  const { members } = props;
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
    // console.log("recentChats", recentChats);
  }, []);

  const [recentChats, setRecentChats] = useState<IChatDocument[]>([]);

  return (
    <div>
      {recentChats.map((chat, key) => {
        return <ChatItem item={chat} key={key} members={members} />;
      })}
    </div>
  );
};

export default RecentChats;
