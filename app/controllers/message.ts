import * as Mongoose from "mongoose";
import { IMessageDocument } from "../models/Message";
import { getChat } from "./chat";
import { socket } from "@/socket";

async function sendMessage(
  createdBy: String,
  content: String,
  type: String,
  chatId: String
) {
  const data = await fetch("/api/message", {
    method: "POST",
    body: JSON.stringify({ createdBy, content, type, chatId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  return response;
}

async function updateMessage(body: any) {
  const data = await fetch("/api/message", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  socket.emit("updateMessage", body);

  const response = await data.json();
  return response;
}

async function deleteMessage(id: String) {
  const data = await fetch("/api/message", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  const response = await data.json();
  return response;
}

export { sendMessage, updateMessage, deleteMessage };
