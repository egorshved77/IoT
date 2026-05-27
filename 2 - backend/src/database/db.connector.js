import * as mock from "./engine/mock.js";
import * as sql from "./engine/mysql.js";
import * as dto from "./db.dto.js"

let _db;
const _engine = process.env.DB_ENGINE ?? "";

export const initDatabase = async () => {

  if (_engine.toLowerCase() === "mysql") {
    console.log("Database engine: MySQL");
    _db = sql;
  } else if (_engine.toLowerCase() === "mock") {
    console.log("Database engine: Mock");
    _db = mock;
  } else {
    console.log(`CRITICAL - Unknown database engine '${_engine}'`);
    process.exit(1);
  }

  _db.initEngine();
}

export const getUniqueDeviceData = async () => {
  return await _db.getUniqueDeviceData();
};

export const getMeasurementData = async (device, options = {}) => {
  return await _db.getMeasurementData(device, options);
};

export const addMeasurementData = async (payload) => {
  const data = dto.createMeasurementRecord(payload);

  await _db.addMeasurementData(data);

  console.log(data);

  return data;
};

export const getConnection = async () => {
  return _db.getConnection?.() || {};
};

export default {
  initDatabase,
  getUniqueDeviceData,
  getMeasurementData,
  addMeasurementData,
  getConnection,
};
