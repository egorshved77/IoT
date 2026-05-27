let _db_mock;

export const initEngine = async () => {
  _db_mock = [];
};

export const getUniqueDeviceData = async () => {
  const dataDevice = _db_mock.map((e) => e["device"]);
  const dataDeviceUnique = new Set(dataDevice);

  return [...dataDeviceUnique];
};

export const getMeasurementData = async (device, options = {}) => {
  const { limit = 50, offset = 0, sort = "DESC", timeRange = "all" } = options;

  let data = _db_mock;

  // Filter by device
  if (device) {
    data = data.filter((e) => e["device"] === device);
  }

  // Filter by time range
  if (timeRange !== "all") {
    const now = new Date();
    let cutoffDate;

    switch (timeRange) {
      case "lastHour":
        cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "today":
        cutoffDate = new Date(now);
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = null;
    }

    if (cutoffDate) {
      data = data.filter((e) => new Date(e.received_at) >= cutoffDate);
    }
  }

  // Sort
  data.sort((a, b) => {
    const timeA = new Date(a.received_at);
    const timeB = new Date(b.received_at);
    return sort === "ASC" ? timeA - timeB : timeB - timeA;
  });

  // Paginate
  const paginatedData = data.slice(offset, offset + limit);

  return paginatedData;
};

export const addMeasurementData = async (payload) => {
  _db_mock.push(payload);
};
