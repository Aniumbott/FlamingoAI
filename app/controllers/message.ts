import { socket } from "@/socket";
import { getAssistantResponse } from "./assistant";

async function createMessage(
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

async function getMessage(id: String) {
  const data = await fetch(`/api/message/?id=${id}`, {
    method: "GET",
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

async function updateMessageContent(body: any) {
  // get all messages from chat
  const data = await fetch("/api/message", {
    method: "PUT",
    body: JSON.stringify({ body, action: "deleteMany" }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  socket.emit("updateMessage", body.chatId, response.message);

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
    createMessage(
      message.createdBy,
      res.gptRes.choices[0].message.content,
      "assistant",
      message.chatId
    );
  });
}

export {
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
  updateMessageContent,
  sendAssistantMessage,
};
