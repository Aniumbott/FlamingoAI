import * as Mongoose from "mongoose";
import { socket } from "@/socket";
import { IPromptFolderDocument } from "../models/PromptFolder";
type Scope = "public" | "private" | "system";

const createPromptFolder = async (
  scope: Scope,
  parentFolder: Mongoose.Types.ObjectId | null,
  createdBy: string,
  workspaceId: string
) => {
  const data = await fetch("/api/promptfolder", {
    method: "POST",
    body: JSON.stringify({ createdBy, scope, workspaceId, parentFolder }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  if (scope === "public")
    socket.emit("changeInPromptFolder", workspaceId, response.promptFolder);
  else socket.emit("changeInPersonalPromptFolder", response.promptFolder);
  return response;
};

const getPromptFolders = async (
  workspaceId: string,
  scope: Scope,
  createdBy: string
) => {
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
};

const updatePromptFolder = async (id: string, body: any) => {
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
  else socket.emit("changeInPersonalPromptFolder", response.promptFolder);
  return response;
};

const deletePromptFolder = async (folder: IPromptFolderDocument) => {
  const data = await fetch("/api/promptfolder", {
    method: "DELETE",
    body: JSON.stringify({ id: folder._id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  if (folder.scope === "public")
    socket.emit("changeInPromptFolder", folder.workspaceId, folder);
  else socket.emit("changeInPersonalPromptFolder", folder);
  return response;
};

export {
  createPromptFolder,
  getPromptFolders,
  updatePromptFolder,
  deletePromptFolder,
};
