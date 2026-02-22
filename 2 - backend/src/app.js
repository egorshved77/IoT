import express from "express";
import cors from "cors";
import iotRoutes from "./modules/iot/iot.controller.rest.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/iot", iotRoutes);

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "online" });
});

export default app;
