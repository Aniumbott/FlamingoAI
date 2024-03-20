import { IChatDocument } from "../models/Chat";

const createdBy = "user_2dsZmTZTBij5xjWmPjvirpXKtsL";
const workspaceId = "org_2dsZqn6iZka7bixMpUXGc9oa8at";

async function createChat(scope: String, parentFolder: String | null) {
  const data = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ createdBy, scope, workspaceId, parentFolder }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
}

async function getChats(scope: String) {
  const data = await fetch("/api/chat", {
    method: "GET",
    body: JSON.stringify({ workspaceId, scope, createdBy }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
}

async function updateChat(id: String, body: any) {
  const data = await fetch("/api/chat", {
    method: "PUT",
    body: JSON.stringify({ id, ...body }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
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
  return data;
}

export { createChat, getChats, updateChat, deleteChat };
