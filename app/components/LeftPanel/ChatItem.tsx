// Modules
import { useRouter, usePathname } from "next/navigation";
import Mongoose from "mongoose";
import { Avatar, Group, Text } from "@mantine/core";
import { IconAlignJustified } from "@tabler/icons-react";

// Compoonents
import style from "../RightPanel/RightPanel.module.css";
import { IChatDocument } from "@/app/models/Chat";
import { createChat } from "@/app/controllers/chat";

export default function ChatItem(props: {
  item: IChatDocument;
  members: any[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { item, members } = props;
  return (
    <>
      <div
        className={style.prompt}
        onClick={() => {
          const newUrl =
            pathname?.split("/").slice(0, 3).join("/") + "/" + item._id;
          window.history.pushState({}, "", newUrl);
        }}
      >
        <div className="flex flex-row justify-between w-full">
          <Group>
            <IconAlignJustified
              color="gray"
              style={{
                width: "1rem",
                height: "1rem",
              }}
            />
            <Text size="sm" style={{ marginLeft: "0.1rem" }}>
              {item.name}
            </Text>
          </Group>
          <Avatar.Group>
            {members.map((member, key) =>
              item.participants.includes(member.userId) ? (
                <Avatar key={key} size="25px" src={member.imageUrl} />
              ) : null
            )}
          </Avatar.Group>
        </div>
      </div>
    </>
  );
}
