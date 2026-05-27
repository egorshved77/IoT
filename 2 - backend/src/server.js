import "dotenv/config";

import http from "http";
import app from "./app.js";
import logger from "../utils/logger.js";
import { initWebSocket } from "./modules/web/web.controller.socket.js";
import { initMqtt } from "./modules/iot/iot.controller.mqtt.js";
import { initDatabase } from "./database/db.connector.js";

const server = http.createServer(app);

server.listen(process.env.PORT, "0.0.0.0", async () => {
  const port = process.env.PORT ?? 3000;
  logger.info(`Backend running on: http://0.0.0.0:${port}`);

  initDatabase();

  if (process.env.WEB_ENABLED === "true") {
    logger.info("WebSocket initialized");
    initWebSocket(server);
  }

  if (process.env.MQTT_ENABLED === "true") {
    logger.info("MQTT initialized");
    initMqtt();
  }
});
