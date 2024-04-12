import * as Mongoose from "mongoose";
import { IChatDocument } from "../models/Chat";
import { socket } from "@/socket";
type Scope = "public" | "private";

async function createChat(
  scope: Scope,
  parentFolder: Mongoose.Types.ObjectId | null,
  createdBy: string,
  workspaceId: string
) {
  const data = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ createdBy, scope, workspaceId, parentFolder }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  console.log(socket);
  if (scope === "public") socket.emit("createChat", workspaceId, response.chat);
  else socket.emit("createPersonalChat", response.chat);
  return response;
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

  if (scope === "public") socket.emit("createChat", workspaceId, response.chat);
  else socket.emit("createPersonalChat", response.chat);
  return response;
}

async function getChat(id: String, workspaceId: String) {
  // console.log("collecting all chats");
  const data = await fetch(`/api/chat/?&workspaceId=${workspaceId}&id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}

async function getIndependentChats(
  scope: Scope,
  createdBy: string,
  workspaceId: string
) {
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

async function getAllChats(createdBy: string, workspaceId: string) {
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

async function getArchivedChats(createdBy: string, workspaceId: string) {
  const data = await fetch(
    `/api/chat/?workspaceId=${workspaceId}&createdBy=${createdBy}&id=archived`,
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
  if (response.chat.scope === "public")
    socket.emit("createChat", response.chat.workspaceId, response.chat);
  else socket.emit("createPersonalChat", response.chat);

  // socket.emit("newChat", response.chat);
  return response;
}

async function deleteChat(chat: IChatDocument) {
  // call controller to delete messages message ref array
  const id = chat._id;
  const data = await fetch("/api/chat", {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  if (chat.scope === "public")
    socket.emit("createChat", chat.workspaceId, chat);
  else socket.emit("createPersonalChat", chat);
  return response;
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
  getArchivedChats,
  updateChat,
  deleteChat,
  sortItems,
};
