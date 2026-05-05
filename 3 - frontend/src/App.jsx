import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const webSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    webSocket.on("connect", () => setConnected(true));
    webSocket.on("disconnect", () => setConnected(false));
    webSocket.on("measurement", (data) => setMeasurements((prev) => [data, ...prev].slice(0, 10)));

    return () => webSocket.close();
  }, []);

  return (
    <div>
      <h2>Measurements - Status: {connected ? "LIVE" : "DISCONNECTED"}</h2>
      <ul>
        {measurements.map((item, id) => (
          <li key={id}>
            {new Date(item.received_at).toLocaleTimeString()} device: {item.device} sensor: {item.sensor} payload: {item.payload}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
