import * as dto from "./iot.dto.js";
import * as database from "../../database/db.connector.js";
import * as socket from "../dashboard/socket.handler.js";

export const getUniqueDevice = async () => {
  const data = await database.getUniqueDeviceData();

  return dto.createGetUniqueDeviceResponse(data);
};

export const getMeasurement = async (device) => {
  dto.validateGetMeasurementQuery(device);

  const data = await database.getMeasurementData(device);

  return dto.createGetMeasurementResponse(data);
};

export const addMeasurement = async (payload) => {
  dto.validateAddMeasurementBody(payload);

  const data = await database.addMeasurementData(payload);
  socket.broadcastMeasurementData(data);

  return dto.createAddMeasurementResponse(data);
};
