import { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./Dashboard.module.scss";

const SOCKET_URL = "http://localhost:3000";

const Dashboard = () => {
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
    <div className={styles["body"]}>
      <DashboardHeader connected={connected} />
      <DashboardData measurements={measurements} />
    </div>
  );
};

const DashboardHeader = ({ connected }) => {
  return <h2>Measurements - Status: {connected ? "LIVE" : "DISCONNECTED"}</h2>;
};

const DashboardData = ({ measurements }) => {
  return (
    <ul className={styles["records"]}>
      {measurements.map((item, id) => (
        <Record key={id} item={item} />
      ))}
    </ul>
  );
};

const Record = ({ item }) => {
  const { device, sensor, payload, received_at } = item;
  const date = new Date(received_at).toLocaleTimeString();

  return (
    <li className={styles["records__item"]}>
      <div className={styles["records__item--short"]}>{date}</div>
      <div className={styles["records__item--short"]}>device: {device}</div>
      <div className={styles["records__item--short"]}>sensor: {sensor}</div>
      <div className={styles["records__item--long"]}>payload: {payload}</div>
    </li>
  );
};

export default Dashboard;
