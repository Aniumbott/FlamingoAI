// Modules
import { useHover } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Mongoose from "mongoose";
import { Avatar, Group, Text, ActionIcon, TextInput } from "@mantine/core";
import {
  IconAlignJustified,
  IconBulbFilled,
  IconDots,
  IconPlayerPlay,
  IconStarFilled,
} from "@tabler/icons-react";

// Compoonents
import style from "../RightPanel/RightPanel.module.css";
import { IChatDocument } from "@/app/models/Chat";
import { createChat, updateChat } from "@/app/controllers/chat";
import { useAuth } from "@clerk/nextjs";
import { IPromptDocument } from "@/app/models/Prompt";
import PromptFeatureMenu from "./Menu/PromptFeatureMenu";
import { ModalControls } from "./PromptPanel";

export default function PromptItem(props: {
  item: IPromptDocument;
  modalControls: ModalControls;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { item } = props;
  const { hovered, ref } = useHover();
  const [menuOpen, setMenuOpen] = useState(false);
  const [rename, setRename] = useState(false);
  let actionIconVisible = (hovered || menuOpen) && item.scope !== "system";
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
          props.modalControls.setModalItem(item);
          props.modalControls.setOpenModal(true);
        }}
      >
        <div ref={ref} className="flex flex-row justify-between w-full">
          <Group>
            {item.scope === "system" ? (
              hovered ? (
                <IconPlayerPlay size={20} color="#34D399" />
              ) : (
                <IconBulbFilled size={20} style={{ color: "#34D399" }} />
              )
            ) : hovered ? (
              <IconPlayerPlay size={20} color="#34D399" />
            ) : (
              <IconBulbFilled size={20} />
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
                    // updateChat(item._id, {
                    //   name: event.currentTarget.value,
                    // }).then((res) => {
                    //   setRename(false);
                    // });
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
                size="20px"
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
                <IconDots size={20} />
                <PromptFeatureMenu
                  prompt={item}
                  open={menuOpen}
                  setOpen={setMenuOpen}
                  setRename={setRename}
                  setMoveModal={setOpenMoveModal}
                  modalControls={props.modalControls}
                />
              </ActionIcon>
            ) : null
          ) : null}
        </div>
      </div>
      {/* {openMoveModal && (
        <MoveChats
          opened={openMoveModal}
          setOpened={setOpenMoveModal}
          item={item}
        />
      )} */}
    </>
  );
}
