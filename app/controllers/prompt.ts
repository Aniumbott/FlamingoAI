import * as Mongoose from "mongoose";
import { socket } from "@/socket";
import { IPromptDocument } from "../models/Prompt";
type Scope = "public" | "private" | "system";

const createPrompt = async (
  name: string,
  content: string,
  description: string,
  scope: string,
  parentFolder: Mongoose.Types.ObjectId | null,
  createdBy: string,
  workspaceId: string
) => {
  const data = await fetch("/api/prompt", {
    method: "POST",
    body: JSON.stringify({
      name,
      content,
      description,
      createdBy,
      scope,
      workspaceId,
      parentFolder,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  //   console.log(socket);
  if (scope === "public")
    socket.emit("changeInPrompt", workspaceId, response.prompt);
  else socket.emit("changeInPersonalPrompt", response.prompt);
  return response;
};

const getPrompts = async (
  workspaceId: string,
  scope: Scope,
  createdBy: string
) => {
  const data = await fetch(
    `/api/prompt/?workspaceId=${workspaceId}&scope=${scope}&createdBy=${createdBy}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const response = await data.json();
  return response;
};

const getAllPrompts = async (
  workspaceId: string,
  createdBy: string
) => {
  const data = await fetch(
    `/api/prompt/?workspaceId=${workspaceId}&createdBy=${createdBy}&id=all`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const response = await data.json();
  return response;
};

const updatePrompt = async (id: string, body: any) => {
  const data = await fetch(`/api/prompt`, {
    method: "PUT",
    body: JSON.stringify({ id, ...body }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  if (response.prompt.scope === "public")
    socket.emit("changeInPrompt", response.prompt.workspaceId, response.prompt);
  else socket.emit("changeInPersonalPrompt", response.prompt);

  return response;
};

const deletePrompt = async (prompt: IPromptDocument) => {
  const data = await fetch(`/api/prompt`, {
    method: "DELETE",
    body: JSON.stringify({ id: prompt._id }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();

  if (prompt.scope === "public")
    socket.emit("changeInPrompt", prompt.workspaceId, prompt);
  else socket.emit("changeInPersonalPrompt", prompt);

  return response;
};

export { createPrompt, getPrompts, getAllPrompts, updatePrompt, deletePrompt };
