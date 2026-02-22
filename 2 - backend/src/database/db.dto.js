export const createMeasurementRecord = (payload) => {
  return { received_at: new Date(), ...payload };
};