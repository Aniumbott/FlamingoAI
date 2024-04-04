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

async function updateChat(id: String, body: any) {
  const data = await fetch("/api/chat", {
    method: "PUT",
    body: JSON.stringify({ id, ...body }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  console.log("chatController", response);
  if (response.chat.scope === "public")
    socket.emit("createChat", response.chat.workspaceId, response.chat);
  else socket.emit("createPersonalChat", response.chat);

  // socket.emit("newChat", response.chat);
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
