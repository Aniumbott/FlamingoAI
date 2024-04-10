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

  const [breadcrumb, setBreadcrumb] = useState([
    { id: "null", name: "public" },
  ]);

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
    const search = (
      folders: IChatFolderDocument[]
    ): IChatFolderDocument | undefined => {
      for (let folder of folders) {
        if (folder._id === id) {
          return folder;
        }

        if (folder.subFolders && folder.subFolders.length > 0) {
          const foundFolder = search(
            folder.subFolders as IChatFolderDocument[]
          );
          if (foundFolder) {
            return foundFolder;
          }
        }
      }
    };

    let folder = search(publicFolders);
    if (folder) return folder;

    return search(privateFolders);
  };

  useEffect(() => {
    fetchFolders();
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
        <Title order={3}>{`Move "${item.name}"`}</Title>
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
                setBreadcrumb([{ id: "null", name: "public" }]);
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
                setBreadcrumb([{ id: "null", name: "private" }]);
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
                ).then(() => fetchFolders())
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
                onClick={() =>
                  moveItem(item, breadcrumb, searchFolder).then(() =>
                    setOpened(false)
                  )
                }
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

const createNewFolder = async (
  breadcrumb: any,
  selectedTab: any,
  userId: string,
  orgId: string
) => {
  const id = breadcrumb[breadcrumb.length - 1].id;
  if (id !== "null") {
    await createChatFolder(
      selectedTab,
      breadcrumb[breadcrumb.length - 1]
        .id as unknown as Mongoose.Types.ObjectId,
      userId || "",
      orgId || ""
    );
  } else {
    await createChatFolder(selectedTab, null, userId || "", orgId || "");
  }
};

const moveItem = async (
  currentItem: any,
  breadcrumb: any,
  searchFolder: (id: string) => IChatFolderDocument | undefined
) => {
  const targetFolderId =
    breadcrumb[breadcrumb.length - 1].id === "null"
      ? breadcrumb[breadcrumb.length - 1].name
      : breadcrumb[breadcrumb.length - 1].id;

  let parentFolderId = "null";
  if (currentItem.parentFolder) {
    const previousParentFolder = searchFolder(currentItem.parentFolder);
    parentFolderId = previousParentFolder?._id || "null";
  }

  let newScope = null;
  let targetScope = null;
  // Fetch the current and target folders
  if (targetFolderId === "public" || targetFolderId === "private") {
    targetScope = targetFolderId;
  } else {
    const targetFolder = searchFolder(targetFolderId);
    targetScope = targetFolder?.scope;
  }
  // Check if the scopes of the current and target folders are different
  if (currentItem?.scope !== targetScope) {
    // If they are, show a confirmation dialog
    newScope = targetScope;
    const proceed = confirm(
      "The target folder has a different scope. Do you want to proceed?"
    );
    // If the user clicks Cancel, return
    if (!proceed) {
      return;
    }
  }

  if (currentItem.messages) {
    await updateChat(currentItem._id, {
      targetFolderId: targetFolderId,
      parentFolderId: parentFolderId,
      newScope: newScope,
    });
  } else {
    await updateChatFolders(currentItem._id, {
      targetFolderId: targetFolderId,
      parentFolderId: parentFolderId,
      newScope: newScope,
    });
  }
};

export default MoveItems;
