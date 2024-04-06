import * as Mongoose from "mongoose";
import { IMessageDocument } from "../models/Message";

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

async function updateMessage(id: String, body: any) {
  const data = await fetch("/api/message", {
    method: "PUT",
    body: JSON.stringify({ id, ...body }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}
async function deleteMessage() {
  const data = await fetch("/api/message", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}

export { sendMessage, updateMessage, deleteMessage };
