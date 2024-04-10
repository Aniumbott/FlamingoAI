import { socket } from "@/socket";

async function createComment(
  createdBy: String,
  content: String,
  messageId: String,
  chatId: String,
  parent: String | null
) {
  const data = await fetch("/api/comment", {
    method: "POST",
    body: JSON.stringify({ createdBy, content, messageId, parent }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  socket.emit("createComment", chatId, response.comment);

  return response;
}

async function getComments(messageId: String) {
  const data = await fetch(`/api/comment/?&messageId=${messageId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}

async function updateComment(chatId: String, body: any) {
  const data = await fetch("/api/comment", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();

  socket.emit("updateComment", chatId, response.comment);

  return response;
}

async function deleteComment(chatId: String, body: any) {
  const data = await fetch("/api/comment", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const response = await data.json();
  socket.emit("deleteComment", chatId, body);
  return response;
}

export { createComment, getComments, updateComment, deleteComment };
