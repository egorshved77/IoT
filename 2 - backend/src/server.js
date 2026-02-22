import "dotenv/config";

import http from "http";
import app from "./app.js";
import { initWebSocket } from "./modules/web/web.controller.socket.js";
import { initMqtt } from "./modules/iot/iot.controller.mqtt.js";
import { initDatabase } from "./database/db.connector.js";

const server = http.createServer(app);

server.listen(process.env.PORT, "0.0.0.0", async () => {
  console.log(`Backend running on: http://0.0.0.0:${process.env.PORT ?? 3000}`);

  initDatabase();

  if (process.env.WEB_ENABLED === "true") {
    initWebSocket(server);
  }

  if (process.env.MQTT_ENABLED === "true") {
    initMqtt();
  }
});
