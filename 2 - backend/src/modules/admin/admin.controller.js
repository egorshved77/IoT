import db from "../../database/db.connector.js";

const seedDatabase = async (req, res) => {
  try {
    const connection = await db.getConnection();
    
    // Clear existing data
    await connection.query("DELETE FROM measurements WHERE 1=1");
    
    // Generate mock data for the last 24 hours
    const now = new Date();
    const mockData = [];
    
    for (let i = 0; i < 288; i++) { // 288 = 24 hours * 12 measurements per hour
      const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000); // 5 min intervals
      
      // Generate realistic sensor data
      const temperature = 20 + Math.sin(i / 20) * 5 + Math.random() * 2;
      const humidity = 50 + Math.cos(i / 30) * 10 + Math.random() * 5;
      
      mockData.push({
        device: "esp32-dht11",
        sensor: "dht11",
        temperature: temperature.toFixed(1),
        humidity: humidity.toFixed(1),
        received_at: timestamp.toISOString().replace('T', ' ').slice(0, 19),
      });
    }
    
    // Insert mock data
    for (const data of mockData) {
      await connection.query(
        "INSERT INTO measurements (device, sensor, payload, received_at) VALUES (?, ?, ?, ?)",
        [
          data.device,
          data.sensor,
          JSON.stringify({ temperature: data.temperature, humidity: data.humidity }),
          data.received_at,
        ]
      );
    }
    
    connection.release();
    res.json({ success: true, message: `Seeded ${mockData.length} measurements` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const purgeDatabase = async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.query("DELETE FROM measurements WHERE 1=1");
    connection.release();
    
    res.json({ success: true, message: "All measurements deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { seedDatabase, purgeDatabase };
