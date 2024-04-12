import * as Mongoose from "mongoose";
import { socket } from "@/socket";
import { IPromptFolderDocument } from "../models/PromptFolder";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";
type Scope = "public" | "private" | "system";

const createPromptFolder = async (
  scope: Scope,
  parentFolder: Mongoose.Types.ObjectId | null,
  createdBy: string,
  workspaceId: string
) => {
  const notificationId = showLoadingNotification("Creating prompt folder...");
  try {
    const data = await fetch("/api/promptfolder", {
      method: "POST",
      body: JSON.stringify({ createdBy, scope, workspaceId, parentFolder }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await data.json();
    if (scope === "public")
      socket.emit("updatePrompt", workspaceId, response.promptFolder);
    else socket.emit("updatePersonalPrompt", response.promptFolder);
    showSuccessNotification(notificationId, "Prompt Folder Created");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to create prompt folder");
    console.error(err);
    return err;
  }
};

const getPromptFolders = async (
  workspaceId: string,
  scope: Scope,
  createdBy: string
) => {
  try {
    const data = await fetch(
      `/api/promptfolder/?scope=${scope}&workspaceId=${workspaceId}&createdBy=${createdBy}`,
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
};

const updatePromptFolder = async (id: string, body: any) => {
  const notificationId = showLoadingNotification("Saving changes...");
  try {
    const data = await fetch("/api/promptfolder", {
      method: "PUT",
      body: JSON.stringify({ id, ...body }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    if (response.promptFolder.scope === "public")
      socket.emit(
        "changeInPromptFolder",
        response.promptFolder.workspaceId,
        response.promptFolder
      );
    else socket.emit("updatePersonalPrompt", response.promptFolder);
    showSuccessNotification(notificationId, "Prompt folder updated");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to save changes");
    console.error(err);
    return err;
  }
};

const deletePromptFolder = async (folder: IPromptFolderDocument) => {
  const notificationId = showLoadingNotification("Deleting prompt folder...");
  try {
    const data = await fetch("/api/promptfolder", {
      method: "DELETE",
      body: JSON.stringify({ id: folder._id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    if (folder.scope === "public")
      socket.emit("updatePrompt", folder.workspaceId, folder);
    else socket.emit("updatePersonalPrompt", folder);
    showSuccessNotification(notificationId, "Prompt folder deleted");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to delete prompt folder");
    console.error(err);
    return err;
  }
};

export {
  createPromptFolder,
  getPromptFolders,
  updatePromptFolder,
  deletePromptFolder,
};
