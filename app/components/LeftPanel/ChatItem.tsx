// Modules
import { useRouter, usePathname } from "next/navigation";
import Mongoose from "mongoose";
import { Text } from "@mantine/core";
import { IconAlignJustified } from "@tabler/icons-react";

// Compoonents
import style from "../RightPanel/RightPanel.module.css";
import { IChatDocument } from "@/app/models/Chat";
import { createChat } from "@/app/controllers/chat";

export const newChat = async (
  scope: "private" | "public",
  parentFolder: Mongoose.Types.ObjectId | null
) => {
  console.log("creating new chat");
  const res = await createChat(scope, parentFolder);
  console.log("res", res);
  return res;
};

export default function ChatItem(props: { item: IChatDocument }) {
  const router = useRouter();
  const pathname = usePathname();
  const { item } = props;
  return (
    <>
      <div
        className={style.prompt}
        onClick={() => {
          const newUrl =
            pathname.split("/").slice(0, 3).join("/") + "/" + item._id;
          window.history.pushState({}, "", newUrl);
        }}
      >
        <IconAlignJustified
          color="gray"
          style={{
            width: "1rem",
            height: "1rem",
          }}
        />
        <Text size="sm" style={{ marginLeft: "0.5rem" }}>
          {item.name}
        </Text>
      </div>
    </>
  );
}
