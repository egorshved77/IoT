import { Router } from "express";
import * as service from "./iot.service.js";
import * as dto from "./iot.dto.js";

const router = Router();

router.get("/device", async (req, res) => {
  console.log("REST request - Get unique devices");

  try {
    const results = await service.getUniqueDevice();

    res.status(200).json(results);
  } catch (error) {
    res.status(400).json(dto.createErrorResponse(error.message));
  }
});

router.get("/data", async (req, res) => {
  console.log("Rest request - Get measurement data");

  try {
    const { device } = req.query;

    const results = await service.getMeasurement(device);

    res.status(200).json(results);
  } catch (error) {
    res.status(400).json(dto.createErrorResponse(error.message));
  }
});

router.post("/data", async (req, res) => {
  console.log("REST request - Add measurement data");

  try {
    const results = await service.addMeasurement(req.body);

    res.status(201).json(results);
  } catch (error) {
    res.status(400).json(dto.createErrorResponse(error.message));
  }
});

export default router;
