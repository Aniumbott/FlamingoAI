import * as Mongoose from "mongoose";
import { IChatFolderDocument } from "../models/ChatFolder";
import { socket } from "@/socket";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";

type Scope = "public" | "private";

// Function to get chat folders
async function getChatFolders(
  scope: Scope,
  createdBy: string,
  workspaceId: string
) {
  try {
    const data = await fetch(
      `/api/chatfolder/?scope=${scope}&workspaceId=${workspaceId}&createdBy=${createdBy}`,
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

// Function to create chat folder
async function createChatFolder(
  scope: Scope,
  parentFolder: Mongoose.Types.ObjectId | null,
  createdBy: string,
  workspaceId: string
) {
  const notificationId = showLoadingNotification("Creating chat folder...");
  try {
    const data = await fetch("/api/chatfolder", {
      method: "POST",
      body: JSON.stringify({ createdBy, scope, workspaceId, parentFolder }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await data.json();
    if (scope === "public")
      socket.emit("updateChat", workspaceId, response.chatFolder);
    else socket.emit("updatePersonalChat", response.chatFolder);
    showSuccessNotification(notificationId, "Chat folder created");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to create chat folder");
    console.error(err);
    return err;
  }
}

// Function to update chat folders
async function updateChatFolders(id: String, body: any) {
  const notificationId = showLoadingNotification("Saving changes...");
  try {
    const data = await fetch("/api/chatfolder", {
      method: "PUT",
      body: JSON.stringify({ id, ...body }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    if (response.chatFolder.scope === "public")
      socket.emit(
        "updateChat",
        response.chatFolder.workspaceId,
        response.chatFolder
      );
    else socket.emit("updatePersonalChat", response.chatFolder);
    showSuccessNotification(notificationId, "Changes saved");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to save changes");
    return err;
  }
}

// Function to delete chat folders
async function deleteChatFolders(folder: IChatFolderDocument) {
  const notificationId = showLoadingNotification("Deleting chat folder...");
  try {
    const id = folder._id;
    const data = await fetch("/api/chatfolder", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();

    if (folder.scope === "public")
      socket.emit("updateChat", folder.workspaceId, folder);
    else socket.emit("updatePersonalChat", folder);
    showSuccessNotification(notificationId, "Chat folder deleted");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to delete chat folder");
    console.error(err);
    return err;
  }
}

export {
  getChatFolders,
  createChatFolder,
  updateChatFolders,
  deleteChatFolders,
};
