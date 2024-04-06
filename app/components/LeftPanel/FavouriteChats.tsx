// Modules
import { useEffect, useState } from "react";

// Components
import { getAllChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import ChatItem from "./ChatItem";
import { useAuth } from "@clerk/nextjs";
import { ScrollArea } from "@mantine/core";
import { socket } from "@/socket";

const FavouriteChats = (props: { members: any[] }) => {
  const { members } = props;
  const { userId, orgId } = useAuth();
  useEffect(() => {
    const fetchAllChats = async () => {
      const allChats = (await getAllChats(userId || "", orgId || "")).chats;
      const favourites = allChats.filter(
        (chat: IChatDocument) => chat.favourite === true
      );
      setFavouriteChats(favourites);
    };
    fetchAllChats();
    socket.on("newChat", (chat) => {
      fetchAllChats();
    });
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
