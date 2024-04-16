import * as Mongoose from "mongoose";
import { IChatDocument } from "../models/Chat";
import { socket } from "@/socket";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { createElement } from "react";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";
type Scope = "public" | "private" | "viewOnly";

async function createChat(
  scope: Scope,
  parentFolder: Mongoose.Types.ObjectId | null,
  createdBy: string,
  workspaceId: string,
  members: any[]
) {
  const notificationId = showLoadingNotification("Creating chat...");
  try {
    const userId = members.map((member) => member.userId);
    console.log(userId);
    const data = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        createdBy,
        scope,
        workspaceId,
        parentFolder,
        members: userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await data.json();

    if (scope === "private") socket.emit("updatePersonalChat", response.chat);
    else socket.emit("updateChat", workspaceId, response.chat);
    showSuccessNotification(notificationId, "Chat created");
    console.log(response);
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to create chat");
    console.error(err);
    return err;
  }
}

async function createChatFork(
  messageId: String,
  id: String,
  workspaceId: String,
  name: String,
  scope: String,
  createdBy: String,
  isComments: Boolean
) {
  const notificationId = showLoadingNotification("Forking chat...");

  const data = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      messageId,
      id,
      workspaceId,
      name,
      scope,
      createdBy,
      isComments,
      action: "fork",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();

  showSuccessNotification(notificationId, "Chat Forked");
  if (scope === "private") socket.emit("updatePersonalChat", response.chat);
  else socket.emit("updateChat", workspaceId, response.chat);
  return response;
}

async function getChat(id: String, workspaceId: String, createdBy: string) {
  try {
    const data = await fetch(
      `/api/chat/?&workspaceId=${workspaceId}&id=${id}&createdBy=${createdBy}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

// chats that done haae any parent
async function getIndependentChats(
  scope: Scope,
  createdBy: string,
  workspaceId: string
) {
  try {
    const data = await fetch(
      `/api/chat/?scope=${scope}&workspaceId=${workspaceId}&createdBy=${createdBy}&action=independent`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function getAllChats(createdBy: string, workspaceId: string) {
  try {
    const data = await fetch(
      `/api/chat/?workspaceId=${workspaceId}&createdBy=${createdBy}&action=all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function getArchivedChats(createdBy: string, workspaceId: string) {
  try {
    const data = await fetch(
      `/api/chat/?workspaceId=${workspaceId}&createdBy=${createdBy}&action=archived`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function getAllPopulatedChats(createdBy: string, workspaceId: string) {
  try {
    const data = await fetch(
      `/api/chat/?workspaceId=${workspaceId}&createdBy=${createdBy}&action=allPopulated`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function updateChat(id: String, body: any) {
  const notificationId = showLoadingNotification("Saving Changes...");
  try {
    const data = await fetch("/api/chat", {
      method: "PUT",
      body: JSON.stringify({ id, ...body }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    if (response.chat.scope === "private")
      socket.emit("updatePersonalChat", response.chat);
    else socket.emit("updateChat", response.chat.workspaceId, response.chat);

    showSuccessNotification(notificationId, "Changes Saved");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to save changes");
    console.error(err);
    return err;
  }
}

async function updateChatAccess(id: String, body: any) {
  const notificationId = showLoadingNotification("Saving Changes...");
  try {
    const data = await fetch("/api/chat", {
      method: "PUT",
      body: JSON.stringify({ id, ...body }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();

    socket.emit("updateChat", response.chat.workspaceId, response.chat);

    showSuccessNotification(notificationId, "Changes Saved");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to save changes");
    console.error(err);
    return err;
  }
}

async function deleteChat(chat: IChatDocument) {
  // call controller to delete messages message ref array
  const notificationId = showLoadingNotification("Deleting Chat...");
  try {
    const id = chat._id;
    const data = await fetch("/api/chat", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await data.json();
    if (chat.scope === "private") socket.emit("updatePersonalChat", chat);
    else socket.emit("updateChat", chat.workspaceId, chat);

    showSuccessNotification(notificationId, "Chat Deleted");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to delete chat");
    console.error(err);
    return err;
  }
}

const sortItems = (items: any, sortType: string): any => {
  let sortedItems;
  switch (sortType) {
    case "A-Z":
      sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "Z-A":
      sortedItems = [...items].sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "New":
      sortedItems = [...items].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      break;
    case "Old":
      sortedItems = [...items].sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
      break;
    default:
      sortedItems = items;
  }

  // Sort the subfolders of each item
  sortedItems.forEach((item: any) => {
    if (item.subFolders?.length > 0) {
      item.subFolders = sortItems(item.subFolders, sortType);
    }
  });

  return sortedItems;
};

export {
  createChat,
  createChatFork,
  getChat,
  getIndependentChats,
  getAllChats,
  getAllPopulatedChats,
  getArchivedChats,
  updateChat,
  updateChatAccess,
  deleteChat,
  sortItems,
};
