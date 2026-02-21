const _db_mock = [];

export const getUniqueDeviceData = async () => {
  const dataRaw = await loadDatabase();

  const dataDevice = dataRaw.map((e) => e["device"]);
  const dataDeviceUnique = new Set(dataDevice);

  return [...dataDeviceUnique];
};

export const getMeasurementData = async (device) => {
  const data = await loadDatabase();

  if (device) {
    return data.filter((e) => e["device"] === device);
  }

  return data;
};

export const addMeasurementData = async (payload) => {
  const record = createMeasurementRecord(payload);

  await addToDatabase(record);

  return record;
};

//-----------------------------------------------------------------------

const loadDatabase = async () => {
  return _db_mock;
};

const addToDatabase = async (record) => {
  _db_mock.push(record);
};

//-----------------------------------------------------------------------

const createMeasurementRecord = (payload) => {
  return { received_at: new Date(), ...payload };
};
