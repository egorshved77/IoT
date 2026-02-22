import { Server } from "socket.io";

let io;

export const initWebSocket = async (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Dashboard connected (client: ${socket.id})`);

    socket.on("disconnect", () => {
      console.log(`Dashboard disconnected: (client ${socket.id})`);
    });
  });
};

export const broadcastMeasurementData = (data) => {
  if (io) {
    io.emit("measurement", data);
  }
};
