// Modules
import { useHover } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Mongoose from "mongoose";
import { Avatar, Group, Text, ActionIcon, TextInput } from "@mantine/core";
import { IconAlignJustified, IconStarFilled } from "@tabler/icons-react";

// Compoonents
import style from "../LeftPanel.module.css";
import { IChatDocument } from "@/app/models/Chat";
import { updateChat } from "@/app/controllers/chat";
import ChatFeatureMenu from "../Menu/ChatFeatureMenu";
import MoveChats from "../Modals/MoveItems/MoveItems";
import { useAuth } from "@clerk/nextjs";

export default function ChatItem(props: {
  item: IChatDocument;
  members: any[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { item, members } = props;
  const { hovered, ref } = useHover();
  const [menuOpen, setMenuOpen] = useState(false);
  const [rename, setRename] = useState(false);
  let actionIconVisible = hovered || menuOpen;
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const { userId, orgId } = useAuth();
  useEffect(() => {
    actionIconVisible = hovered || menuOpen;
  }, [hovered, menuOpen]);

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
        <div ref={ref} className="flex flex-row justify-between w-full">
          <Group>
            {item.favourites.includes(userId || "") ? (
              <IconStarFilled
                style={{
                  color: "#FFD700",
                  width: "1rem",
                  height: "1rem",
                }}
              />
            ) : (
              <IconAlignJustified
                color="gray"
                style={{
                  width: "1rem",
                  height: "1rem",
                }}
              />
            )}

            {rename ? (
              <TextInput
                autoFocus
                variant="filled"
                placeholder="Rename"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onBlur={() => setRename(false)}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === "Enter") {
                    updateChat(item._id, {
                      name: event.currentTarget.value,
                    }).then((res) => {
                      setRename(false);
                    });
                  }
                }}
              />
            ) : (
              <Text size="sm" style={{ marginLeft: "0.1rem" }}>
                {item.name}
              </Text>
            )}
          </Group>
          {!rename ? (
            actionIconVisible ? (
              <ActionIcon
                size="25px"
                variant="subtle"
                aria-label=""
                color="#9CA3AF"
                // {...(hovered ? { opacity: "1" } : { opacity: "0" })}
                style={{
                  "--ai-hover-color": "white",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ChatFeatureMenu
                  chat={item}
                  members={members}
                  open={menuOpen}
                  setOpen={setMenuOpen}
                  setRename={setRename}
                  setMoveModal={setOpenMoveModal}
                />
              </ActionIcon>
            ) : (
              <Avatar.Group
              // {...(hovered ? { opacity: "0" } : { opacity: "1" })}
              >
                {members.map((member, key) =>
                  item.participants.includes(member.userId) ? (
                    <Avatar key={key} size="25px" src={member.imageUrl} />
                  ) : null
                )}
              </Avatar.Group>
            )
          ) : null}
        </div>
      </div>
      {openMoveModal && (
        <MoveChats
          opened={openMoveModal}
          setOpened={setOpenMoveModal}
          item={item}
        />
      )}
    </>
  );
}
