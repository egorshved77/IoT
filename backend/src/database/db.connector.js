// import * as db from "./engine/mock.js";
import * as db from "./engine/mysql.js";

export const getUniqueDeviceData = async () => {
  return await db.getUniqueDeviceData();
};

export const getMeasurementData = async (device) => {
  return await db.getMeasurementData(device);
};

export const addMeasurementData = async (payload) => {
  const data = await db.addMeasurementData(payload);

  console.log(data);

  return data
};
