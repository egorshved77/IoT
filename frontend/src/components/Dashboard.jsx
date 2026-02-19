import { useState, useEffect } from "react";
import io from "socket.io-client";
import styles from "./Dashboard.module.scss";

const SOCKET_URL = "http://localhost:3000";

const Dashboard = () => {
  const [_, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const webSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    webSocket.on("connect", () => {
      console.log("Socket Connected:", webSocket.id);
      setConnected(true);
    });

    webSocket.on("disconnect", () => {
      console.log("Socket Disconnected:", webSocket.id);
      setConnected(false);
    });

    webSocket.on("measurement", (data) => {
      console.log("Measurement:", data);
      setMeasurements((prev) => [data, ...prev].slice(0, 10));
    });

    setSocket(webSocket);

    return () => webSocket.close();
  }, []);

  return (
    <div>
      <h1>IoT Dashboard</h1>

      <div>
        Status: <strong>{connected ? "LIVE ●" : "DISCONNECTED ○"}</strong>
      </div>

      <h3>Measurements</h3>
      <ul>
        {measurements.map((item, id) => (
          <li key={id}>
            {new Date(item.timestamp).toLocaleTimeString()} -<strong> DATA - {item.data}</strong>
            <span>
              (id: {item.device}, record: {item.id})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
