import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Select,
  SelectProps,
  Text,
  Tooltip,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import {
  IconLayoutSidebarLeftExpand,
  IconLink,
  IconDownload,
} from "@tabler/icons-react";
import { Editor } from "@tiptap/react";
export default function Toolbar(props: {
  editor: Editor | null;
  active: number;
  leftOpened: boolean;
  page: any;
  toggleLeft: () => void;
  saveContent: () => void;
  setOpenDownload: (value: boolean) => void;
}) {
  const {
    editor,
    active,
    leftOpened,
    toggleLeft,
    page,
    saveContent,
    setOpenDownload,
  } = props;
  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => (
    <Group flex="1" gap="xs">
      <Text
        fz="sm"
        c={checked ? "var(--mantine-primary-color-filled)" : ""}
        ff={option.value}
      >
        {option.label}
      </Text>
    </Group>
  );
  return (
    <Card
      radius="md"
      p="sm"
      shadow="sm"
      w={"100%"}
      style={{
        flexShrink: 0,
      }}
    >
      <RichTextEditor editor={editor} style={{ border: "none" }}>
        <RichTextEditor.Toolbar
          p={0}
          // display={isDragging || active != id ? "none" : "flex"}
          style={{
            // right: "0",
            background: "transparent",
            borderBottom: "none",
          }}
        >
          <div className="w-full h-full flex flex-row items-center justify-between flex-wrap gap-2">
            <Group gap={"sm"}>
              {!leftOpened && (
                <Tooltip label="Expand panel" fz="xs">
                  <ActionIcon
                    variant="subtle"
                    color="grey"
                    aria-label="Expand panel"
                    onClick={toggleLeft}
                  >
                    <IconLayoutSidebarLeftExpand
                      style={{ width: "90%", height: "90%" }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                </Tooltip>
              )}

              <Text>{page.name}</Text>
            </Group>
            <Group>
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
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.ColorPicker
                  colorPickerProps={{ format: "rgba" }}
                  colors={[
                    "#25262b",
                    "#868e96",
                    "#fa5252",
                    "#e64980",
                    "#be4bdb",
                    "#7950f2",
                    "#4c6ef5",
                    "#228be6",
                    "#15aabf",
                    "#12b886",
                    "#40c057",
                    "#82c91e",
                    "#fab005",
                    "#fd7e14",
                  ]}
                  onChange={(e) => {
                    editor?.chain().focus().setFontFamily("Inter").run();
                  }}
                />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <Select
                  w="auto"
                  defaultValue="unset"
                  size="xs"
                  data={[
                    { label: "Sans Serif", value: "sans-serif" },
                    { label: "Inter", value: "unset" },
                    { label: "Arial", value: "arial" },
                    { label: "Helvetica", value: "helvetica" },
                    { label: "Serif", value: "serif" },
                    { label: "Times New Roman", value: "times-new-roman" },
                    { label: "Garmond", value: "garamond" },
                    { label: "Georgia", value: "georgia" },
                    { label: "Monospace", value: "monospace" },
                    { label: "Courier", value: "courier" },
                    { label: "Courier New", value: "courier-new" },
                  ]}
                  onChange={(e) => {
                    if (e === "unset") {
                      editor?.chain().focus().unsetFontFamily().run();
                    } else {
                      editor
                        ?.chain()
                        .focus()
                        .setFontFamily(e || "")
                        .run();
                    }
                  }}
                  allowDeselect={false}
                  renderOption={renderSelectOption}
                ></Select>
              </RichTextEditor.ControlsGroup>
              {/* <Badge
                variant="light"
                size="md"
                radius="sm"
                p="sm"
                mr="md"
                // display={active == id ? "flex" : "none"}
              >
                ID:{active + 1}
              </Badge> */}
              <ActionIcon variant="light">
                <IconDownload
                  size={20}
                  onClick={() => {
                    setOpenDownload(true);
                  }}
                />
              </ActionIcon>

              <Button variant="light" size="xs" onClick={saveContent}>
                Save
              </Button>
              <ActionIcon variant="light">
                <IconLink size={20} />
              </ActionIcon>
            </Group>
          </div>
        </RichTextEditor.Toolbar>
      </RichTextEditor>
    </Card>
  );
}
