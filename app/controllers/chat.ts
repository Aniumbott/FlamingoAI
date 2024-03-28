import * as Mongoose from "mongoose";
import { IChatDocument } from "../models/Chat";

const createdBy = "user_2dsZmTZTBij5xjWmPjvirpXKtsL";
const workspaceId = "org_2dz9SJPInQzTNl4R7qBx7DfFYby";

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

async function getChat(id: String, workspaceId: String) {
  console.log("collecting all chats");
  const data = await fetch(`/api/chat/?&workspaceId=${workspaceId}&id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}

async function getIndependentChats(scope: Scope) {
  const data = await fetch(
    `/api/chat/?scope=${scope}&workspaceId=${workspaceId}&createdBy=${createdBy}&independent=true`,
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

async function getAllChats() {
  const data = await fetch(
    `/api/chat/?workspaceId=${workspaceId}&createdBy=${createdBy}&id=all`,
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

export {
  createChat,
  getChat,
  getIndependentChats,
  getAllChats,
  updateChat,
  deleteChat,
};
