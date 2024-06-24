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
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log("a user connected");

    // Event listeners
    // Basic
    socket.on("joinChatRoom", (roomId, userId) => {
      socket.join(roomId);
      console.log(`User with ID: ${socket.id} joined Chat: ${roomId}`);
      // Remove user from all other rooms
      if(!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.forEach((users, id) => {
        if (id !== roomId) {
          users.delete(userId);
          io.to(id).emit("onlineUsers", Array.from(rooms.get(id)));
        }
        else{
          users.add(userId);
        }
      });
      const users = Array.from(rooms.get(roomId));
      io.to(roomId).emit("onlineUsers", users);
    });

    socket.on("leaveChatRoom", (roomId, userId) => {
      socket.leave(roomId);
      console.log(`User with ID: ${socket.id} left Chat: ${roomId}`);
      rooms.get(roomId).delete(userId);
      const users = Array.from(rooms.get(roomId));
      io.to(roomId).emit("onlineUsers", users);
    });

    socket.on("joinWorkspaceRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User with ID: ${socket.id} joined Workspace: ${roomId}`);
    });

    socket.on("leaveWorkspaceRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`User with ID: ${socket.id} left Workspace: ${roomId}`);
    });

    socket.on("updateWorkspace", (roomId) => {
      console.log(
        `User with ID: ${socket.id} updated workspace in room: ${roomId}`
      );
      io.to(roomId).emit("updateWorkspace");
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    // Chat and ChatFolders
    socket.on("updateChat", (roomId, item) => {
      console.log(
        `User with ID: ${socket.id} updated chat: ${item} in room: ${roomId}`
      );
      io.to(roomId).emit("refreshChats");
      io.to(roomId).emit("refreshChatWindow");
    });
    
    socket.on("updatePersonalChat", (item) => {
      console.log(
        `User with ID: ${socket.id} updated private chat: ${item} to user: ${socket.id}`
      );
      io.to(socket.id).emit("refreshChats");
      io.to(socket.id).emit("refreshChatWindow");
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

    // Prompts and PromptFolders
    socket.on("updatePrompt", (roomId, prompt) => {
      console.log(
        `User with ID: ${socket.id} changed prompt: ${prompt} in room: ${roomId}`
      );
      io.to(roomId).emit("refreshPrompts", prompt);
    });

    socket.on("updatePersonalPrompt", (prompt) => {
      console.log(
        `User with ID: ${socket.id} changed prompt: ${prompt} in room: ${socket.id}`
      );
      io.to(socket.id).emit("refreshPrompts", prompt);
    });

    socket.on("createImageGen", (roomId, prompt) =>{
      console.log(
        `User with ID: ${socket.id} created image: ${prompt} in room: ${roomId}`
      );
      io.to(roomId).emit("refreshImageGens", prompt);
    })

    socket.on("deleteImageGen", (roomId, prompt) =>{
      console.log(
        `User with ID: ${socket.id} deleted image: ${prompt} in room: ${roomId}`
      );
      io.to(roomId).emit("refreshImageGens", prompt);
    })

    socket.on("createPage", (roomId, page) => {
      console.log(
        `User with ID: ${socket.id} created page: ${page._id} in room: ${roomId}`
      );
      io.to(roomId).emit("refreshPages", page);
    })

    socket.on("deletePage", (roomId, page) => {
      console.log(
        `User with ID: ${socket.id} deleted page: ${page._id} in room: ${roomId}`
      );
      io.to(roomId).emit("refreshPages", page);
    })

    socket.on("updatePage", (roomId, page) => {
      console.log(
        `User with ID: ${socket.id} updated page: ${page._id} in room: ${roomId}`
      );
      io.to(roomId).emit("refreshPages", page);
    })
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
