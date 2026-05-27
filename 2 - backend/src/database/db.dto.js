export const createMeasurementRecord = (payload) => {
  const normalizedPayload =
    typeof payload?.payload === "string" ? payload.payload : JSON.stringify(payload?.payload ?? null);

  // Convert ISO 8601 to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
  const received_at = new Date().toISOString().replace('T', ' ').slice(0, 19);

  return {
    ...payload,
    received_at, // Override payload's received_at with correct MySQL format
    payload: normalizedPayload,
  };
};