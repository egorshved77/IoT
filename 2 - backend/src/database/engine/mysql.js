import mysql from "mysql2/promise";

let _pool;
const _host = process.env.DB_HOST || "localhost";
const _port = process.env.DB_PORT || 3306;
const _user = process.env.DB_USER || "system";
const _password = process.env.DB_PASSWORD;
const _database = process.env.DB_NAME;

export const initEngine = async () => {
  _pool = mysql.createPool({
    host: _host,
    port: _port,
    user: _user,
    password: _password,
    database: _database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  _pool
    .getConnection()
    .then((conn) => {
      console.log("MySQL connection established");
      conn.release();
    })
    .catch((err) => {
      console.error(`CRITICAL - MySQL connection failed${err.message ? `:${err.message}` : ""}`);
      process.exit(1);
    });
};

export const getUniqueDeviceData = async () => {
  const query = `SELECT DISTINCT device FROM measurements`;
  const [rows] = await _pool.execute(query);

  return rows.map((e) => e["device"]);
};

export const getMeasurementData = async (device, options = {}) => {
  const { limit = 50, offset = 0, sort = "DESC", timeRange = "all" } = options;

  let query = `SELECT * FROM measurements`;
  const params = [];

  // Add device filter
  if (device) {
    query += ` WHERE device = ?`;
    params.push(device);
  }

  // Add time range filter
  if (timeRange !== "all") {
    const whereKeyword = device ? "AND" : "WHERE";
    const now = new Date();

    switch (timeRange) {
      case "lastHour":
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        query += ` ${whereKeyword} received_at >= ?`;
        params.push(oneHourAgo.toISOString().replace("T", " ").slice(0, 19));
        break;
      case "today":
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        query += ` ${whereKeyword} received_at >= ?`;
        params.push(startOfDay.toISOString().replace("T", " ").slice(0, 19));
        break;
      case "week":
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        query += ` ${whereKeyword} received_at >= ?`;
        params.push(oneWeekAgo.toISOString().replace("T", " ").slice(0, 19));
        break;
      case "month":
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        query += ` ${whereKeyword} received_at >= ?`;
        params.push(oneMonthAgo.toISOString().replace("T", " ").slice(0, 19));
        break;
    }
  }

  // Add sorting
  query += ` ORDER BY received_at ${sort === "ASC" ? "ASC" : "DESC"}`;

  // Add pagination
  query += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await _pool.execute(query, params);
  return rows;
};

export const addMeasurementData = async (body) => {
  const query = `INSERT INTO measurements (device, sensor, payload, received_at) VALUES (?, ?, ?, ?)`;
  await _pool.execute(query, [body.device, body.sensor, body.payload, body.received_at]);
};

export const getConnection = async () => {
  return await _pool.getConnection();
};
