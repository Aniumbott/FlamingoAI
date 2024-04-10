const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected");

    // Event listeners
    // Basic
    socket.on("joinChatRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User with ID: ${socket.id} joined Chat: ${roomId}`);
    });

    socket.on("leaveChatRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`User with ID: ${socket.id} left Chat: ${roomId}`);
    });

    socket.on("joinWorkspaceRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User with ID: ${socket.id} joined Workspace: ${roomId}`);
    });

    socket.on("leaveWorkspaceRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`User with ID: ${socket.id} left Workspace: ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    // FOLDER
    socket.on("createChatFolder", (roomId, folder) => {
      console.log(
        `User with ID: ${socket.id} created folder: ${folder} in room: ${roomId}`
      );
      io.to(roomId).emit("newChatFolder", folder);
    });

    socket.on("createPersonalChatFolder", (folder) => {
      console.log(
        `User with ID: ${socket.id} created private folder: ${folder} to user: ${socket.id}`
      );
      io.to(socket.id).emit("newChatFolder", folder);
    });

    // Chat
    socket.on("createChat", (roomId, chat) => {
      console.log(
        `User with ID: ${socket.id} created chat: ${chat} in room: ${roomId}`
      );
      io.to(roomId).emit("newChat", chat);
    });
    socket.on("createPersonalChat", (chat) => {
      console.log(
        `User with ID: ${socket.id} created private chat: ${chat} to user: ${socket.id}`
      );
      io.to(socket.id).emit("newChat", chat);
    });

    // Message
    socket.on("createMessage", (roomId, message) => {
      console.log(
        `User with ID: ${socket.id} sent message: ${message} in room: ${roomId}`
      );
      io.to(roomId).emit("newMessage", message);
    });

    socket.on("updateMessage", (roomId, message) => {
      console.log(
        `User with ID: ${socket.id} updated message: ${message} in room: ${roomId}`
      );
      io.to(roomId).emit("updateMessage", message);
    });

    socket.on("deleteMessage", (roomId, message) => {
      console.log(
        `User with ID: ${socket.id} deleted message: ${message} in room: ${roomId}`
      );
      io.to(roomId).emit("deleteMessage", message);
    });

    // Comments
    socket.on("createComment", (roomId, comment) => {
      console.log(
        `User with ID: ${socket.id} created comment: ${comment} in room: ${roomId}`
      );
      io.to(roomId).emit("newComment", comment);
      io.to(roomId).emit("newCommentInSection", comment);
    });

    socket.on("updateComment", (roomId, comment) => {
      console.log(
        `User with ID: ${socket.id} updated comment: ${comment._id} in room: ${roomId}`
      );
      io.to(roomId).emit("updateComment", comment);
      io.to(roomId).emit("updateCommentInSection", comment);
    });

    socket.on("deleteComment", (roomId, comment) => {
      console.log(
        `User with ID: ${socket.id} deleted comment: ${comment} in room: ${roomId}`
      );
      io.to(roomId).emit("deleteComment", comment);
      io.to(roomId).emit("deleteCommentInSection", comment);
    });

    socket.on("changeInPrompt", (roomId, prompt) => {
      console.log(
        `User with ID: ${socket.id} changed prompt: ${prompt} in room: ${roomId}`
      );
      io.to(roomId).emit("fetchPrompts", prompt);
    });

    socket.on("changeInPersonalPrompt", (prompt) => {
      console.log(
        `User with ID: ${socket.id} changed prompt: ${prompt} in room: ${socket.id}`
      );
      io.to(socket.id).emit("fetchPrompts", prompt);
    });

    socket.on("changeInPromptFolder", (roomId, promptFolder) => {
      console.log(
        `User with ID: ${socket.id} changed prompt folder: ${promptFolder} in room: ${roomId}`
      );
      io.to(roomId).emit("fetchPromptFolders", promptFolder);
    });

    socket.on("changeInPersonalPromptFolder", (promptFolder) => {
      console.log(
        `User with ID: ${socket.id} changed prompt folder: ${promptFolder} in room: ${socket.id}`
      );
      io.to(socket.id).emit("fetchPromptFolders", promptFolder);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
