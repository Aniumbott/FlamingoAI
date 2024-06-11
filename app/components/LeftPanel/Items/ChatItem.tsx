// Modules
import { useHover } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  allowPublic: boolean;
  allowPersonal: boolean;
}) {
  const pathname = usePathname();
  const { item, members } = props;
  const { hovered, ref } = useHover();
  const [menuOpen, setMenuOpen] = useState(false);
  const [rename, setRename] = useState(false);
  let actionIconVisible = hovered || menuOpen;
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const { userId, orgId } = useAuth();
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    actionIconVisible = hovered || menuOpen;
  }, [hovered, menuOpen]);

  function isActive(pathname: string, id: string) {
    return pathname.split("/")[3] === id;
  }

  useEffect(() => {
    setParticipants(
      members.filter((member) => item.participants.includes(member.userId))
    );
  }, [item.participants, members]);

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
          <div className="flex flex-row items-center grow">
            {item.favourites.includes(userId || "") ? (
              <IconStarFilled
                style={{
                  color: isActive(pathname, item._id)
                    ? "var(--mantine-primary-color-filled)"
                    : "#FFD700",
                  width: "1rem",
                  height: "1rem",
                }}
              />
            ) : (
              <IconAlignJustified
                style={{
                  color: isActive(pathname, item._id)
                    ? "var(--mantine-primary-color-filled)"
                    : "grey",
                  width: "1rem",
                  height: "1rem",
                }}
              />
            )}

            {rename ? (
              <TextInput
                ml="sm"
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
              <div className="grow max-w-[180px]">
                <Text
                  ml="sm"
                  truncate="end"
                  size="sm"
                  style={{
                    marginLeft: "0.1rem",
                    color: isActive(pathname, item._id)
                      ? "var(--mantine-primary-color-filled)"
                      : "",
                  }}
                >
                  {item.name}
                </Text>
              </div>
            )}
          </div>
          {!rename ? (
            actionIconVisible ? (
              <ChatFeatureMenu
                chat={item}
                members={members}
                open={menuOpen}
                setOpen={setMenuOpen}
                setRename={setRename}
                setMoveModal={setOpenMoveModal}
              />
            ) : (
              <Avatar.Group>
                {participants.length <= 2 ? (
                  participants.map((member, key) =>
                    member.hasImage ? (
                      <Avatar key={key} size="25px" src={member.imageUrl} />
                    ) : (
                      <Avatar key={key} size="25px">
                        {member.firstName[0] + member.lastName[0]}
                      </Avatar>
                    )
                  )
                ) : (
                  <>
                    {participants[participants.length - 1].hasImage ? (
                      <Avatar
                        size="25px"
                        src={participants[participants.length - 1].imageUrl}
                      />
                    ) : (
                      <Avatar size="25px">
                        {participants[participants.length - 1].firstName[0] +
                          participants[participants.length - 1].lastName[0]}
                      </Avatar>
                    )}

                    {participants[participants.length - 2].hasImage ? (
                      <Avatar
                        size="25px"
                        src={participants[participants.length - 2].imageUrl}
                      />
                    ) : (
                      <Avatar size="25px">
                        {participants[participants.length - 2].firstName[0] +
                          participants[participants.length - 2].lastName[0]}
                      </Avatar>
                    )}
                    <Avatar size="25px">+{participants.length - 2}</Avatar>
                  </>
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
          allowPublic={props.allowPublic}
          allowPersonal={props.allowPersonal}
        />
      )}
    </>
  );
}
