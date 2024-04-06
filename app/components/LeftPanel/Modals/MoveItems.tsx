import React, { useEffect, useState } from "react";
import {
  Accordion,
  Breadcrumbs,
  Button,
  Divider,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Title,
} from "@mantine/core";
import {
  createChatFolder,
  getChatFolders,
  updateChatFolders,
} from "@/app/controllers/folders";
import { IChatFolderDocument } from "@/app/models/ChatFolder";
import { useAuth } from "@clerk/nextjs";
import FolderAccordian from "./FolderAccordian";
import style from "../../RightPanel/RightPanel.module.css";
import { IconCaretRightFilled } from "@tabler/icons-react";
import { IChatDocument } from "@/app/models/Chat";
import * as Mongoose from "mongoose";
import { socket } from "@/socket";
import { updateChat } from "@/app/controllers/chat";

const MoveItems = (props: {
  opened: boolean;
  setOpened: (value: boolean) => void;
  item: IChatDocument | IChatFolderDocument;
}) => {
  const { opened, setOpened, item } = props;
  const [publicFolders, setPublicFolders] = useState<IChatFolderDocument[]>([]);
  const [privateFolders, setPrivateFolders] = useState<IChatFolderDocument[]>(
    []
  );
  const { userId, orgId } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"public" | "private">(
    "public"
  );

  const [breadcrumb, setBreadcrumb] = useState([{ id: "null", name: "Root" }]);

  const fetchFolders = async () => {
    try {
      setPublicFolders(
        (await getChatFolders("public", userId || "", orgId || "")).chatFolder
      );
      setPrivateFolders(
        (await getChatFolders("private", userId || "", orgId || "")).chatFolder
      );
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };

  const handleBreadcrumb = (value: string | null) => {
    if (value === null) {
      breadcrumb.pop();
    } else {
      while (breadcrumb[breadcrumb.length - 1].id !== "null") {
        breadcrumb.pop();
      }
      const id = value.split(":")[0];
      const name = value.split(":")[1];
      breadcrumb.push({ id, name });
    }
    setBreadcrumb([...breadcrumb]);
  };

  const searchFolder = (id: string) => {
    console.log("searching folder", id);
    const folder = publicFolders.find((folder) => folder._id === id);
    if (folder) return folder;
    return privateFolders.find((folder) => folder._id === id);
  };

  useEffect(() => {
    fetchFolders();
    console.log(opened, item);
    // socket.on("newChatFolder", (folder) => {
    //   console.log("new folder created");
    //   fetchFolders();
    // });
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      padding={0}
      size={"80%"}
      withCloseButton={false}
    >
      <Stack gap={"sm"} p={"sm"}>
        <Title order={3}>Move &qout;{item.name}&quot;</Title>
        <Stack gap={"md"} p={"sm"}>
          <div className="flex gap-2">
            Current Location:
            <Breadcrumbs>
              {breadcrumb.map((item) => (
                <span key={item.id}>{item.name}</span>
              ))}
            </Breadcrumbs>
          </div>

          <Group>
            <Button
              color={"teal"}
              c={"white"}
              onClick={() => {
                setSelectedTab("public");
                setBreadcrumb([{ id: "null", name: "Root" }]);
              }}
              {...(selectedTab === "public"
                ? { variant: "outline" }
                : { variant: "subtle" })}
            >
              SHARED
            </Button>
            <Button
              color={"teal"}
              c={"white"}
              onClick={() => {
                setSelectedTab("private");
                setBreadcrumb([{ id: "null", name: "Root" }]);
              }}
              {...(selectedTab === "private"
                ? { variant: "outline" }
                : { variant: "subtle" })}
            >
              PERSONAL
            </Button>
          </Group>
          <Divider />
          <ScrollArea h="40vh" scrollbarSize={10} offsetScrollbars>
            {selectedTab === "public" ? (
              <Accordion
                chevronPosition="left"
                className={style.parent}
                classNames={{ chevron: style.chevron }}
                chevron={<IconCaretRightFilled className={style.icon} />}
                onChange={(value) => handleBreadcrumb(value)}
              >
                {publicFolders.map((folder, subIndex) => (
                  <FolderAccordian
                    folder={folder}
                    breadcrumb={breadcrumb}
                    setBreadcrumb={setBreadcrumb}
                    key={subIndex}
                    currentId={item._id}
                  />
                ))}
              </Accordion>
            ) : (
              <Accordion
                chevronPosition="left"
                className={style.parent}
                classNames={{ chevron: style.chevron }}
                chevron={<IconCaretRightFilled className={style.icon} />}
                onChange={(value) => handleBreadcrumb(value)}
              >
                {privateFolders.map((folder, subIndex) => (
                  <FolderAccordian
                    folder={folder}
                    breadcrumb={breadcrumb}
                    setBreadcrumb={setBreadcrumb}
                    key={subIndex}
                    currentId={item._id}
                  />
                ))}
              </Accordion>
            )}
          </ScrollArea>
          <Divider />
          <Group justify="space-between">
            <Button
              variant="subtle"
              c={"white"}
              onClick={() =>
                createNewFolder(
                  breadcrumb,
                  selectedTab,
                  userId || "",
                  orgId || ""
                )
              }
            >
              Create New Folder
            </Button>
            <Group>
              <Button
                variant="default"
                color="teal"
                onClick={() => setOpened(false)}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color="teal"
                onClick={() => moveItem(item, breadcrumb, searchFolder)}
              >
                Move
              </Button>
            </Group>
          </Group>
        </Stack>
      </Stack>
    </Modal>
  );
};

const createNewFolder = (
  breadcrumb: any,
  selectedTab: any,
  userId: string,
  orgId: string
) => {
  const id = breadcrumb[breadcrumb.length - 1].id;
  if (id !== "null") {
    createChatFolder(
      selectedTab,
      breadcrumb[breadcrumb.length - 1]
        .id as unknown as Mongoose.Types.ObjectId,
      userId || "",
      orgId || ""
    );
  } else {
    createChatFolder(selectedTab, null, userId || "", orgId || "");
  }
};

const moveItem = async (
  currentItem: any,
  breadcrumb: any,
  searchFolder: (id: string) => IChatFolderDocument | undefined
) => {
  const id = breadcrumb[breadcrumb.length - 1].id;
  console.log(currentItem, id);

  if (currentItem.messages) {
    if (currentItem.parentFolder) {
      const previousParentFolder = searchFolder(currentItem.parentFolder);
      console.log(previousParentFolder);

      const res = await updateChatFolders(previousParentFolder?._id, {
        chats: previousParentFolder?.chats.filter(
          (chat) => chat._id !== currentItem._id
        ),
      });
      console.log("chat removed from previous parent", res);
    }

    if (id === "null") {
      const res = await updateChat(currentItem._id, {
        parentFolder: null,
      });
      console.log("chat updated", res);
    } else {
      const res = await updateChat(currentItem._id, {
        parentFolder: id,
      });
      console.log("chat updated", res);
      const newParentFolder = searchFolder(id);
      const newChats = newParentFolder?.chats || [];
      updateChatFolders(newParentFolder?._id, {
        chats: [...newChats, currentItem._id],
      }).then((res) => {
        console.log("new parent's chats[] updated", res);
      });
    }
  } else {
    if (currentItem.parentFolder) {
      const previousParentFolder = searchFolder(currentItem.parentFolder);
      console.log(previousParentFolder);

      const res = await updateChatFolders(previousParentFolder?._id, {
        subFolders: previousParentFolder?.subFolders.filter(
          (subFolder) => subFolder._id !== currentItem._id
        ),
      });
      console.log("folder removed from previous parents folder[]", res);
    }

    if (id === "null") {
      const res = await updateChatFolders(currentItem._id, {
        parentFolder: null,
      });
      console.log("folder updated", res);
    } else {
      const res = await updateChatFolders(currentItem._id, {
        parentFolder: id,
      });
      console.log("folder updated", res);
      const newParentFolder = searchFolder(id);
      const newsubFolders = newParentFolder?.subFolders || [];
      updateChatFolders(newParentFolder?._id, {
        subFolders: [...newsubFolders, currentItem._id],
      }).then((res) => {
        console.log("new parent's subfolders[] updated", res);
      });
    }
  }
};

export default MoveItems;
