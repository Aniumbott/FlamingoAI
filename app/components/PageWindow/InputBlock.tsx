import { ActionIcon, Badge, Group, useMantineColorScheme } from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { useEffect, useState } from "react";
import {
  IconGripVertical,
  IconRowInsertBottom,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import TextStyle from "@tiptap/extension-text-style";
import Menu from "./Menu";
import { useHover } from "@mantine/hooks";

export default function InputBlock(props: {
  editors: (Editor | null)[];
  handleEditors: any;
  index: number;
  provided: any;
  isDragging: boolean;
  active: number;
  setActive: (value: number) => void;
  setIsPanelOpened: (value: boolean) => void;
}) {
  const {
    editors,
    handleEditors,
    index,
    provided,
    isDragging,
    active,
    setActive,
    setIsPanelOpened,
  } = props;
  const { hovered, ref } = useHover();
  const [openMenu, setOpenMenu] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  return (
    <Group
      ref={ref}
      mt="xs"
      key={index}
      style={{
        flexWrap: "nowrap",
      }}
      gap={"sm"}
      align="flex-end"
      justify="center"
    >
      <ActionIcon
        variant="subtle"
        color="grey"
        size="sm"
        disabled={editors.length <= 1}
        style={{
          zIndex: hovered || active == index || isDragging ? 1 : -999,
        }}
        onClick={() => {
          if (editors.length > 1) {
            if (index == 0) {
              setActive(index + 1);
            } else {
              setActive(index - 1);
            }
            handleEditors.remove(index);
          }
        }}
      >
        <IconTrash size={20} />
      </ActionIcon>
      <div
        {...provided.dragHandleProps}
        className="flex"
        style={{
          zIndex: hovered || active == index || isDragging ? 1 : -999,
        }}
      >
        <ActionIcon variant="subtle" color="grey" size="sm">
          <IconGripVertical size={20} />
        </ActionIcon>
      </div>
      <RichTextEditor
        onFocus={() => setActive(index)}
        w={"100%"}
        maw="800px"
        editor={editors[index]!}
        style={{
          border:
            active == index
              ? "1px solid transparent"
              : hovered || isDragging
              ? ""
              : "1px solid transparent",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <RichTextEditor.Toolbar display={"none"} />
        <Badge
          pos="absolute"
          size="xs"
          variant="transparent"
          color={active == index ? "" : "grey"}
          bottom="2px"
          right="2px"
        >
          [{index + 1}]
        </Badge>
        <RichTextEditor.Content
          bg={
            active == index
              ? colorScheme == "light"
                ? "var(--mantine-color-gray-1)"
                : "var(--mantine-color-dark-7)"
              : "none"
          }
        />
      </RichTextEditor>
      <ActionIcon
        variant="subtle"
        color="grey"
        style={{
          zIndex: hovered || active == index || isDragging ? 1 : -999,
        }}
        onClick={() => {
          setActive(index + 1);
          handleEditors.insert(
            index + 1,
            new Editor({
              extensions: [
                StarterKit,
                Underline,
                Link,
                Superscript,
                Subscript,
                Highlight,
                Color,
                TextStyle,
                FontFamily,
                TextAlign.configure({ types: ["heading", "paragraph"] }),
              ],
            })
          );
        }}
      >
        <IconRowInsertBottom size={"20px"} />
      </ActionIcon>

      {/* <Menu
          open={openMenu}
          setOpen={setOpenMenu}
          setIsPanelOpened={setIsPanelOpened}
        /> */}
      <ActionIcon
        variant="subtle"
        color="grey"
        style={{
          zIndex: hovered || active == index || isDragging ? 1 : -999,
        }}
        onClick={() => {
          setActive(index);
          setIsPanelOpened(true);
        }}
      >
        <IconSparkles size={20} />
      </ActionIcon>
    </Group>
  );
}
