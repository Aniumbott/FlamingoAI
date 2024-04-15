// Modules
import { useEffect, useState } from "react";

// Components
import { getAllChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import ChatItem from "../Items/ChatItem";
import { useAuth } from "@clerk/nextjs";
import { ScrollArea, Loader, Text } from "@mantine/core";
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
      console.log("unmounting favourite chats");
      socket.off("refreshChats");
    };
  }, []);

  const [favouriteChats, setFavouriteChats] = useState<IChatDocument[] | null>(
    null
  );

  return (
    <div>
      <ScrollArea h="50vh" scrollbarSize={10} offsetScrollbars>
        {favouriteChats ? (
          favouriteChats.length === 0 ? (
            <Text style={{ textAlign: "center" }} c="gray" size="xs">
              No favourite Chats
            </Text>
          ) : (
            favouriteChats.map((chat, key) => {
              return <ChatItem item={chat} key={key} members={members} />;
            })
          )
        ) : (
          <Loader type="dots" w={"100%"} color="teal" />
        )}
      </ScrollArea>
    </div>
  );
};

export default FavouriteChats;
