import * as Mongoose from "mongoose";
import { IMessageDocument } from "../models/Message";
import { getChat } from "./chat";
import { socket } from "@/socket";
import { getAssistantResponse } from "./assistant";

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
  socket.emit("createMessage", chatId, response.message);
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
  console.log("response at update Message", response);
  socket.emit("updateMessage", body.chatId, response.message);
  return response;
}

async function deleteMessage(body: any) {
  const data = await fetch("/api/message", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const response = await data.json();
  socket.emit("deleteMessage", body.chatId, body);
  return response;
}

async function updateMessageContent(
  createdBy: String,
  content: String,
  chatId: String,
  createdAt: Date
) {
  // get all messages from chat
  const getMessages = await fetch(`/api/message/?chatId=${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const messages = (await getMessages.json()).messages;

  const toBeDeleted = messages.filter((msg: any) => {
    return msg.createdAt >= createdAt;
  });

  console.log("toBeDeleted", toBeDeleted);

  for (const msg of toBeDeleted) {
    await deleteMessage(msg);
  }

  const data = sendMessage(createdBy, content, "user", chatId);

  const response = data;
  return response;
}

async function sendAssistantMessage(
  message: any,
  workspaceId: string,
  model: string
) {
  const getMessages = await fetch(`/api/message/?chatId=${message.chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const messages = (await getMessages.json()).messages;

  getAssistantResponse(
    messages
      .filter((msg: any) => {
        return msg.createdAt <= message.createdAt;
      })
      .map((msg: any) => {
        return {
          role: msg.type,
          content: msg.content,
        };
      }),
    workspaceId,
    model
  ).then((res) => {
    sendMessage(
      message.createdBy,
      res.gptRes.choices[0].message.content,
      "assistant",
      message.chatId
    );
  });
}

export {
  sendMessage,
  updateMessage,
  deleteMessage,
  updateMessageContent,
  sendAssistantMessage,
};
