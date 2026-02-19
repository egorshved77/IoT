export const createGetUniqueDeviceResponse = (data) => {
  return {
    status: "success",
    data,
  };
};

export const createGetMeasurementResponse = (data) => {
  return {
    status: "success",
    data,
  };
};

export const createAddMeasurementResponse = () => {
  return {
    status: "success",
  };
};

export const createErrorResponse = (message) => {
  return {
    status: "error",
    message,
  };
};

//------------------------------------------------------

export const validateGetMeasurementPayload = (query) => {};

export const validateAddMeasurementPayload = (payload) => {
  if (!payload) {
    throw new Error("No payload provided");
  }

  if (!payload.device) {
    throw new Error("The device is not defined");
  }

  if (!payload.data) {
    throw new Error("The data is not defined");
  }
};
