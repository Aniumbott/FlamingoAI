import * as Mongoose from "mongoose";
import { IChatDocument } from "../models/Chat";
import { socket } from "@/socket";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";
import { IAIModel, IAIModelDocument } from "../models/AIModel";
type Scope = "public" | "private" | "viewOnly";

// Function to get chats that has no parent
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

// Function to get all the archived chats
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

// Function to get all workspace chats
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

// Funtion to get all workspace chats with members populated
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

// Function to get chats report data
async function getChatsReportData(workspaceId: String) {
  try {
    const data = await fetch(
      `/api/chat/?workspaceId=${workspaceId}&action=reportData`,
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

// Funtion to get single populated Chat
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

// Funtion to create chat fork
async function createChatFork(
  messageId: String,
  id: String,
  workspaceId: String,
  name: String,
  scope: String,
  createdBy: String,
  isComments: Boolean,
  aiModel: string | null
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
      aiModel,
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

// Function to create a new chat
async function createChat(
  scope: Scope,
  parentFolder: Mongoose.Types.ObjectId | null,
  createdBy: string,
  workspaceId: string,
  members: any[],
  name: string = "New Chat",
  instructions: {
    type: string;
    text: string;
    pageId: Mongoose.Types.ObjectId | null;
  } = { type: "text", text: "", pageId: null },
  aiModel: string | null = null
) {
  const notificationId = showLoadingNotification("Creating chat...");
  try {
    const userIds = members.map((member) => member.userId);
    console.log(userIds);
    const data = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        scope,
        parentFolder,
        createdBy,
        workspaceId,
        members: userIds,
        name,
        instructions,
        aiModel,
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

// Function to update chat
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

// Function to update chat access
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

// Function to delete chat and all its contents
async function deleteChat(chat: IChatDocument) {
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

// Function to sort items
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
  getIndependentChats,
  getArchivedChats,
  getAllChats,
  getAllPopulatedChats,
  getChatsReportData,
  getChat,
  createChatFork,
  createChat,
  updateChat,
  updateChatAccess,
  deleteChat,
  sortItems,
};
