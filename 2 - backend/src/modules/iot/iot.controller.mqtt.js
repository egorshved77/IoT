import mqtt from "mqtt";
import * as service from "./iot.service.js";

const mqtt_host = process.env.MQTT_HOST ?? "localhost";
const mqtt_port = process.env.MQTT_PORT ?? "1883";
const mqtt_topic = process.env.MQTT_TOPIC ?? "iot/data";

export const initMqtt = async (brokerUrl = `mqtt://${mqtt_host}:${mqtt_port}`) => {
  const client = mqtt.connect(brokerUrl, {
    clientId: "Backend_IoT_Controller",
  });

  client.on("connect", () => {
    client.subscribe(mqtt_topic, (err) => {
      if (!err) {
        console.log(`MQTT connection established (topic: ${mqtt_topic})`);
      } else {
        console.error(`MQTT connection failed${err.message ? `:${err.message}` : ""}`);
      }
    });
  });

  //-----------------------------------------------------------------------

  client.on("message", async (topic, message) => {
    if (topic === mqtt_topic) {
      console.log("MQTT Request - Add measurement data");

      try {
        const payload = JSON.parse(message.toString());

        await service.addMeasurement(payload);
      } catch (error) {
        console.error("MQTT Error -", error.message);
      }
    }
  });

  return client;
};
