import * as Mongoose from "mongoose";
import { IChatDocument } from "../models/Chat";

const createdBy = "user_2dsZmTZTBij5xjWmPjvirpXKtsL";
const workspaceId = "org_2dsZqn6iZka7bixMpUXGc9oa8at";

type Scope = "public" | "private";

async function createChat(
  scope: Scope,
  parentFolder: Mongoose.Types.ObjectId | null
) {
  const data = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ createdBy, scope, workspaceId, parentFolder }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  return response;
}

async function getChats(scope: Scope) {
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

async function updateChat(id: String, body: any) {
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

async function deleteChat(chat: IChatDocument) {
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

export { createChat, getChats, updateChat, deleteChat };
