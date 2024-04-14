// Modules
import { useEffect, useState } from "react";

// Components
import { getAllChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import ChatItem from "../Items/ChatItem";
import { useAuth } from "@clerk/nextjs";
import { ScrollArea } from "@mantine/core";
import { socket } from "@/socket";

const FavouriteChats = (props: { members: any[] }) => {
  const { members } = props;
  const { userId, orgId } = useAuth();
  useEffect(() => {
    const fetchAllChats = async () => {
      const allChats = (await getAllChats(userId || "", orgId || "")).chats;
      if (userId) {
        const favourites = allChats.filter((chat: IChatDocument) =>
          chat.favourites.includes(userId)
        );
        setFavouriteChats(favourites);
      }
    };
    fetchAllChats();
    socket.on("refreshChats", () => {
      fetchAllChats();
    });

    return () => {
      socket.off("refreshChats");
    };
  }, []);

  const [favouriteChats, setFavouriteChats] = useState<IChatDocument[]>([]);

  return (
    <div>
      <ScrollArea h="50vh" scrollbarSize={10} offsetScrollbars>
        {favouriteChats.map((chat, key) => {
          return <ChatItem item={chat} key={key} members={members} />;
        })}
      </ScrollArea>
    </div>
  );
};

export default FavouriteChats;
