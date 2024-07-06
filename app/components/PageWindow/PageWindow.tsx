import {
  Card,
  Group,
  ScrollArea,
  Loader,
  Stack,
  ActionIcon,
  Modal,
  Button,
  Select,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useListState, useMediaQuery } from "@mantine/hooks";
import InputBlock from "./InputBlock";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Toolbar from "./ToolBar";
import SidePanel from "./SidePanel";
import DownloadModal from "./DownloadModal";
import { getPageById, updatePage } from "@/app/controllers/pages";
import { useAuth } from "@clerk/nextjs";
import { IconInfoCircle, IconMessage } from "@tabler/icons-react";
import CreateChatModal from "./CreateChatModal";

export default function PageWindow(props: {
  leftOpened: boolean;
  toggleLeft: () => void;
  currentPageId: string;
}) {
  const { leftOpened, toggleLeft, currentPageId } = props;
  const { orgId, userId } = useAuth();
  const [active, setActive] = useState(0);
  const [isPanelOpened, setIsPanelOpened] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<any>({
    _id: "",
    name: "",
    content: [],
  });
  const [openDownload, setOpenDownload] = useState(false);
  const isMobile = useMediaQuery(`(max-width: 48em)`);
  const [editors, handleEditors] = useListState<Editor | null>([
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
    }),
  ]);

  useEffect(() => {
    console.log(isDragging);
  }, [isDragging]);

  useEffect(() => {
    const getCurrentPage = async () => {
      return await getPageById(currentPageId, orgId || "");
    };
    setIsLoading(true);
    if (currentPageId) {
      getCurrentPage().then((res) => {
        setPage(res?.pages?.[0]);
        setIsLoading(false);
      });
    }
  }, [currentPageId]);

  useEffect(() => {
    if (page?.content) {
      console.log(page, "page content");
      const newEditors = page.content.map((content: any) => {
        return new Editor({
          content: content,
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
        });
      });
      handleEditors.setState(newEditors);
    }
  }, [page]);

  const saveContent = async () => {
    const content = editors.map((editor) => editor?.getHTML());
    updatePage(page._id, {
      content: content,
    }).then((res) => {
      setPage(res.page);
      console.log(res);
    });
  };

  return !isMobile ? (
    <Group
      w={`calc(100% - 20px)`}
      align="flex-start"
      justify="center"
      style={{
        flexWrap: "nowrap",
      }}
      mih="100vh"
      mah="100vh"
      pl="lg"
      py="md"
      gap="md"
    >
      {!isLoading ? (
        <>
          <Stack h="100%" w="100%">
            {!isPanelOpened && (
              <Toolbar
                editor={editors[active]}
                active={active}
                leftOpened={leftOpened}
                toggleLeft={toggleLeft}
                page={page}
                saveContent={saveContent}
                setOpenDownload={setOpenDownload}
              />
            )}
            <Card
              radius="md"
              shadow="sm"
              h="100%"
              pos="relative"
              style={{
                pointerEvents: isPanelOpened ? "none" : "auto",
              }}
            >
              <ScrollArea scrollbarSize={0} pb="md">
                <Stack>
                  <DragDropContext
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={({ destination, source }) => {
                      setIsDragging(false);
                      handleEditors.reorder({
                        from: source.index,
                        to: destination?.index || 0,
                      });
                      setActive(destination?.index || 0);
                    }}
                  >
                    <Droppable droppableId="dnd-list" direction="vertical">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {editors.map((item, index) => (
                            <Draggable
                              key={index}
                              index={index}
                              draggableId={index.toString()}
                            >
                              {(provided) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <InputBlock
                                      editors={editors}
                                      handleEditors={handleEditors}
                                      key={index}
                                      index={index}
                                      provided={provided}
                                      isDragging={isDragging}
                                      active={active}
                                      setActive={setActive}
                                      setIsPanelOpened={setIsPanelOpened}
                                    />
                                  </div>
                                );
                              }}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Stack>
              </ScrollArea>
              <CreateChatModal
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                page={page}
              />
              <ActionIcon
                variant="light"
                size="xl"
                pos="absolute"
                right="1rem"
                bottom="1rem"
                onClick={() => setIsCreateOpen(true)}
              >
                <IconMessage size="24" />
              </ActionIcon>
            </Card>
          </Stack>
          {isPanelOpened && (
            <SidePanel
              setIsPanelOpened={setIsPanelOpened}
              editor={editors[active]}
              index={active}
              handleEditors={handleEditors}
            />
          )}
          {openDownload && (
            <DownloadModal
              open={openDownload}
              setOpen={setOpenDownload}
              fileName={page?.name || "page"}
              page={page}
            />
          )}
        </>
      ) : (
        <Loader type="dots" size="lg" h={"100%"} />
      )}
    </Group>
  ) : (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-5">
      <Card withBorder radius="md" p="lg">
        <Group justify="space-between">
          <Group gap={"xs"}>
            <IconInfoCircle size="24px" />
            <Title order={3}>Insufficient screen size !!!</Title>
          </Group>
          <Button
            variant="default"
            onClick={() => {
              window.history.back();
            }}
          >
            Back to Workspace
          </Button>
        </Group>
        <Text size="md" c="dimmed" mt="md">
          Pages are only visible on{" "}
          <span
            style={{
              fontWeight: 700,
              color: "var(--mantine-primary-color-filled)",
            }}
          >
            landscape displays
          </span>
          . Kindly change the orientation of the device if possible.
        </Text>
      </Card>
    </div>
  );
}
