import * as Mongoose from "mongoose";
import { IChatFolderDocument } from "../models/ChatFolder";
import { socket } from "@/socket";

// const createdBy = "user_2dsZmTZTBij5xjWmPjvirpXKtsL";
// const workspaceId = "org_2dz9SJPInQzTNl4R7qBx7DfFYby";

type Scope = "public" | "private";

async function createChatFolder(
  scope: Scope,
  parentFolder: Mongoose.Types.ObjectId | null,
  createdBy: string,
  workspaceId: string
) {
  const data = await fetch("/api/chatfolder", {
    method: "POST",
    body: JSON.stringify({ createdBy, scope, workspaceId, parentFolder }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  if (scope === "public")
    socket.emit("createChatFolder", workspaceId, response.chatFolder);
  else socket.emit("createPersonalChatFolder", response.chatFolder);
  return response;
}

async function getChatFolders(
  scope: Scope,
  createdBy: string,
  workspaceId: string
) {
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
  // console.log("response", response);
  return response;
}

async function updateChatFolders(id: String, body: any) {
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
      "createChatFolder",
      response.chatFolder.workspaceId,
      response.chatFolder
    );
  else socket.emit("createPersonalChatFolder", response.chatFolder);
  return response;
}

async function deleteChatFolders(chat: IChatFolderDocument) {
  // call controller to delete messages message ref array

  const data = await fetch("/api/chatfolder", {
    method: "DELETE",
    body: JSON.stringify(chat._id),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}

export {
  createChatFolder,
  getChatFolders,
  updateChatFolders,
  deleteChatFolders,
};
