import { useState } from "react";
import styles from "./Controller.module.scss";

const Controller = () => {
  const [devices, setDevices] = useState(" ");

  return (
    <div>
      <DevicesHeader />
      <DevicesData devices={devices} setDevices={setDevices} />
    </div>
  );
};

const DevicesHeader = () => {
  return <h2>Devices</h2>;
};

const DevicesData = ({ devices, setDevices }) => {
  const onClick = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/iot/device");

      if (!response.ok) {
        setDevices(`The device list could not be retrieved.`);

        return;
      }

      const payload = await response.json();

      if (payload?.data) {
        setDevices(payload.data.join(","));
      }
    } catch (e) {
      setDevices(`Error: ${e}`);
    }
  };

  return (
    <div className={styles["data"]}>
      <button onClick={onClick}>get device data</button>
      <div className={styles["devices"]}>{devices}</div>
    </div>
  );
};

export default Controller;
