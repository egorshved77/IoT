import "dotenv/config";

import http from "http";
import app from "./app.js";
import { initSocket } from "./modules/dashboard/socket.handler.js";

const server = http.createServer(app);

initSocket(server);

server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Running on http://0.0.0.0:${process.env.PORT ?? 3000}`);
});
