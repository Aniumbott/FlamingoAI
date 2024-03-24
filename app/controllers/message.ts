import * as Mongoose from "mongoose";
import { IMessageDocument } from "../models/Message";

async function sendMessage(
  createdBy: string,
  content: string,
  type: string,
  chatId: string
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
