import * as dto from "./iot.dto.js";
import * as database from "../../database/db.connector.js";
import * as socket from "../web/web.controller.socket.js";

export const getUniqueDevice = async () => {
  const data = await database.getUniqueDeviceData();

  return dto.createGetUniqueDeviceResponse(data);
};

export const getMeasurement = async (device, options = {}) => {
  dto.validateGetMeasurementQuery(device);

  const { limit = 50, offset = 0, sort = "DESC", timeRange = "all" } = options;

  const data = await database.getMeasurementData(device, {
    limit,
    offset,
    sort,
    timeRange,
  });

  return dto.createGetMeasurementResponse(data);
};

export const addMeasurement = async (payload) => {
  dto.validateAddMeasurementBody(payload);

  const data = await database.addMeasurementData(payload);
  socket.broadcastMeasurementData(data);

  return dto.createAddMeasurementResponse(data);
};
