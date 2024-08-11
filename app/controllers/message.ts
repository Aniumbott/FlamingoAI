import { socket } from "@/socket";
import { createTokenLog } from "./tokenLog";
import { getPageById } from "./pages";
import { getAIResponse } from "./aiModel";
import { IAIModelDocument } from "../models/AIModel";

// Function to get messages
async function getMessages(chatId: String) {
  const data = await fetch(`/api/message/?chatId=${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}

// Function to get a single message
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

// Function to create message
async function createMessage(
  createdBy: String,
  content: String,
  type: String,
  chatId: String,
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

// Function to update message
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

// Function to update message content
async function updateMessageContent(body: any) {
  console.log("body at updateMessageContent", body);
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

// Function to delete message
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

// Function to send message to assistant
async function sendAssistantMessage(
  messages: any[],
  message: any,
  instruction: any,
  workspaceId: string,
  aiModel: IAIModelDocument,
  scope: string,
) {
  if (messages.length === 0) {
    const getMessages = await fetch(`/api/message/?chatId=${message.chatId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    messages = (await getMessages.json()).messages;
    messages = messages.filter((msg: any) => msg.createdAt < message.createdAt);
  }

  messages = [...messages, message];

  let messagesContent = messages.map((msg: any) => {
    return {
      role: msg.type,
      content: msg.content,
    };
  });

  if (instruction?.type === "text") {
    messagesContent = [
      {
        role: "system",
        content: instruction.text,
      },
      ...messagesContent,
    ];
  } else {
    let systemInstructions: string = "";
    const getCurrentPage = async () => {
      return await getPageById(instruction.pageId, workspaceId);
    };
    await getCurrentPage().then((res) => {
      res?.pages?.[0].content.forEach((contentBlock: string) => {
        systemInstructions = systemInstructions + "\n\n" + contentBlock;
      });
      // console.log("page at func", res?.pages?.[0]);
      systemInstructions =
        "Here provided the content of a markdown page in HTML format. Consider this content while answering." +
        systemInstructions;
      messagesContent = [
        {
          role: "system",
          content: systemInstructions,
        },
        ...messagesContent,
      ];
    });
  }

  return await getAIResponse(
    messagesContent,
    workspaceId,
    aiModel,
    scope,
    message.createdBy,
  )
    .then((res: any) => {
      console.log("res at sendAssistantMessage", res);
      if (res) {
        createMessage(message.createdBy, res.text, "assistant", message.chatId);
      }
      return res;
    })
    .then((res: any) => {
      if (res) {
        createTokenLog(
          message.createdBy,
          message.chatId,
          workspaceId,
          res.usage.promptTokens.toString(),
          res.usage.completionTokens.toString(),
        );
      }
      return res;
    });
}

export {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  updateMessageContent,
  deleteMessage,
  sendAssistantMessage,
};
