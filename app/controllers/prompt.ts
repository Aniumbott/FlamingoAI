import * as Mongoose from "mongoose";
import { socket } from "@/socket";
import { IPromptDocument } from "../models/Prompt";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";
type Scope = "public" | "private" | "system";

// Function to get all personal prompts
const getPrompts = async (
  workspaceId: string,
  scope: Scope,
  createdBy: string
) => {
  try {
    const data = await fetch(
      `/api/prompt/?workspaceId=${workspaceId}&scope=${scope}&createdBy=${createdBy}`,
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
    // console.error(err);
    return err;
  }
};

// Function to get all prompts
const getAllPrompts = async (workspaceId: string, createdBy: string) => {
  try {
    const data = await fetch(
      `/api/prompt/?workspaceId=${workspaceId}&createdBy=${createdBy}&id=all`,
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
    // console.error(err);
    return err;
  }
};

// Function to create prompt
const createPrompt = async (
  name: string,
  content: string,
  description: string,
  scope: string,
  parentFolder: Mongoose.Types.ObjectId | null,
  createdBy: string,
  workspaceId: string
) => {
  const notificationId = showLoadingNotification("Creating prompt...");
  try {
    const data = await fetch("/api/prompt", {
      method: "POST",
      body: JSON.stringify({
        name,
        content,
        description,
        createdBy,
        scope,
        workspaceId,
        parentFolder,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await data.json();
    console.log("created prompt",response)
    if (scope === "public")
      socket.emit("updatePrompt", workspaceId, response.prompt);
    else socket.emit("updatePersonalPrompt", response.prompt);
    showSuccessNotification(notificationId, "Prompt created");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to create prompt");
    // console.error(err);
    return err;
  }
};

// Function to update prompt
const updatePrompt = async (id: string, body: any) => {
  const notificationId = showLoadingNotification("Saving changes...");
  try {
    const data = await fetch(`/api/prompt`, {
      method: "PUT",
      body: JSON.stringify({ id, ...body }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await data.json();
    if (response.prompt.scope === "public")
      socket.emit("updatePrompt", response.prompt.workspaceId, response.prompt);
    else socket.emit("updatePersonalPrompt", response.prompt);
    showSuccessNotification(notificationId, "Changes saved");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to save changes");
    // console.error(err);
    return err;
  }
};

// Function to delete prompt
const deletePrompt = async (prompt: IPromptDocument) => {
  const notificationId = showLoadingNotification("Deleting prompt...");
  try {
    const data = await fetch(`/api/prompt`, {
      method: "DELETE",
      body: JSON.stringify({ id: prompt._id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await data.json();

    if (prompt.scope === "public")
      socket.emit("updatePrompt", prompt.workspaceId, prompt);
    else socket.emit("updatePersonalPrompt", prompt);
    showSuccessNotification(notificationId, "Prompt deleted");
    return response;
  } catch (err) {
    showErrorNotification(notificationId, "Failed to delete prompt");
    // console.error(err);
    return err;
  }
};

export { getPrompts, getAllPrompts, createPrompt, updatePrompt, deletePrompt };
