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

export const validateGetMeasurementQuery = (query) => {};

export const validateAddMeasurementBody = (body) => {
  if (!body) {
    throw new Error("No payload provided");
  }

  if (!body.device) {
    throw new Error("The device ID is not defined");
  }

  if (!body.sensor) {
    throw new Error("The sensor type is not defined");
  }

  if (!body.payload) {
    throw new Error("The payload is not defined");
  }
};
