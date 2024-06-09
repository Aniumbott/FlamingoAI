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
import style from "../../RightPanel.module.css";
import { IPromptDocument } from "@/app/models/Prompt";
import PromptFeatureMenu from "../../Menu/PromptFeatureMenu";
import { ModalControls } from "./PromptsPanel";
import MovePromptItems from "../../Modals/MoveItems/MovePromptItems";

export default function PromptItem(props: {
  item: IPromptDocument;
  modalControls: ModalControls;
  user: any;
  orgId: string;
}) {
  const { item, user, orgId } = props;
  const { hovered, ref } = useHover();
  const [menuOpen, setMenuOpen] = useState(false);
  const [rename, setRename] = useState(false);
  let actionIconVisible = (hovered || menuOpen) && item.scope !== "system";
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (user) {
      const role = user.organizationMemberships.find(
        (org: any) => org.organization.id === orgId
      )?.role;
      setIsAllowed(role === "org:admin" || user?.id === item.createdBy);
    }
  }, [user]);

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
                <IconPlayerPlay
                  size={20}
                  color="var(--mantine-primary-color-filled)"
                />
              ) : (
                <IconBulbFilled
                  size={20}
                  style={{ color: "var(--mantine-primary-color-filled)" }}
                />
              )
            ) : hovered ? (
              <IconPlayerPlay
                size={20}
                color="var(--mantine-primary-color-filled)"
              />
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
            actionIconVisible && isAllowed ? (
              <ActionIcon
                size="20px"
                variant="subtle"
                aria-label="Dots"
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
      {openMoveModal && (
        <MovePromptItems
          opened={openMoveModal}
          setOpened={setOpenMoveModal}
          item={item}
        />
      )}
    </>
  );
}
