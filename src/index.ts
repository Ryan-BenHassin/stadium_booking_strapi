"use strict";
const { Server } = require("socket.io");

module.exports = {
  register() {},

  bootstrap({ strapi }) {
    const io = new Server(strapi.server.httpServer, {
      path: '/ws',
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true,
      },
    });

    // Auth middleware
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.query.token;
        if (!token) throw new Error('No token provided');
        
        const verified = await strapi.plugins['users-permissions'].services.jwt.verify(token);
        socket.user = verified;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    io.on("connection", (socket) => {
      console.log('Client connected:', socket.id);

      socket.on("join", ({ username }) => {
        if (username) {
          socket.join("group");
          socket.emit("welcome", {
            user: "bot",
            text: `${username}, Welcome to the group chat`,
            userData: username,
          });
        }
      });

      socket.on("sendMessage", async (data) => {
        try {
          const message = await strapi.entityService.create('api::message.message', {
            data: {
              content: data.message,
              sender: socket.user.id,
              timestamp: new Date(),
              publishedAt: new Date()
            }
          });

          socket.broadcast.to("group").emit("message", {
            user: data.username,
            text: data.message,
            messageId: message.id
          });
        } catch (error) {
          console.log("error", error.message);
          socket.emit("error", { message: "Failed to send message" });
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  },
};
