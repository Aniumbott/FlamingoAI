import { ActionIcon, Divider, Title } from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { useEffect } from "react";
import { IconRowInsertBottom } from "@tabler/icons-react";

export default function TextEditor(props: {
  content: any[];
  setContent: any;
  index: number;
}) {
  const { content, setContent, index } = props;
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content[index],
    onUpdate({ editor }) {
      let newContent = content;
      // console.log(newContent);
      newContent[index] = editor.getJSON();
      setContent(newContent);
    },
  });

  // useEffect(() => {
  //   editor?.commands.setContent(content[index]);
  // }, [content[index]]);

  return (
    <RichTextEditor
      editor={editor}
      style={{
        border: "none",
        position: "initial",
      }}
    >
      {editor?.isFocused && <RichToolbar />}
      <ActionIcon
        variant="subtle"
        color="grey"
        style={{
          position: "absolute",
          bottom: "0.5rem",
          right: "0.5rem",
          zIndex: 100,
        }}
        onClick={() => {
          let newContent = content;
          newContent.splice(index + 1, 0, {
            type: "doc",
            content: [],
          });
          setContent(newContent);
        }}
      >
        <IconRowInsertBottom size={"20px"} />
      </ActionIcon>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}

const RichToolbar = () => {
  return (
    <RichTextEditor.Toolbar
      style={{
        position: "fixed",
        top: "1rem",
        left: "35rem",
        background: "transparent",
        borderBottom: "none",
      }}
      mih="3rem"
    >
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
        <RichTextEditor.Underline />
        <RichTextEditor.Strikethrough />
        <RichTextEditor.ClearFormatting />
        <RichTextEditor.Highlight />
        <RichTextEditor.Code />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.H1 />
        <RichTextEditor.H2 />
        <RichTextEditor.H3 />
        <RichTextEditor.H4 />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Blockquote />
        <RichTextEditor.Hr />
        <RichTextEditor.BulletList />
        <RichTextEditor.OrderedList />
        <RichTextEditor.Subscript />
        <RichTextEditor.Superscript />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Link />
        <RichTextEditor.Unlink />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.AlignLeft />
        <RichTextEditor.AlignCenter />
        <RichTextEditor.AlignJustify />
        <RichTextEditor.AlignRight />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Undo />
        <RichTextEditor.Redo />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>
  );
};
