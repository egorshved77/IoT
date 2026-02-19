export const createMeasurementRecord = (size, payload) => {
  return { id: size + 1, timestamp: new Date(), ...payload };
};
