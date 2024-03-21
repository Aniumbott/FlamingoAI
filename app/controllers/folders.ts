import * as Mongoose from "mongoose";
import { IChatFolderDocument } from "../models/ChatFolder";

const createdBy = "user_2dsZmTZTBij5xjWmPjvirpXKtsL";
const workspaceId = "org_2dsZqn6iZka7bixMpUXGc9oa8at";

type Scope = "public" | "private";

async function createChatFolder(scope: Scope) {
  const data = await fetch("/api/chatFolder", {
    method: "POST",
    body: JSON.stringify({ createdBy, scope, workspaceId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  return response;
}

async function getChatFolders(scope: Scope) {
  const data = await fetch(
    `/api/chat/?scope=${scope}&workspaceId=${workspaceId}&createdBy=${createdBy}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const response = await data.json();
  return response;
}

async function updateChatFolders(id: String, body: any) {
  const data = await fetch("/api/chat", {
    method: "PUT",
    body: JSON.stringify({ id, ...body }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}

async function deleteChatFolders(chat: IChatFolderDocument) {
  // call controller to delete messages message ref array

  const data = await fetch("/api/chat", {
    method: "DELETE",
    body: JSON.stringify(chat._id),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}

export { createChatFolder, getChatFolders, updateChatFolders, deleteChatFolders };
