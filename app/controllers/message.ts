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

export { sendMessage };
