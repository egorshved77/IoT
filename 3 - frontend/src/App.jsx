import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Login from "./Login";
import AdminPanel from "./AdminPanel";
import Toast from "./Toast";
import { exportToCSV } from "./csvExport";
import {
  setMeasurements,
  addMeasurement,
  setLimit,
} from "./redux/slices/measurementsSlice";
import {
  setTimeRange,
  setSortOrder,
  setSelectedDevices,
  setSelectedSensors,
} from "./redux/slices/filtersSlice";
import {
  setAuthToken,
  setAuthUser,
  setAdminMode,
  logout,
  loginSuccess,
} from "./redux/slices/authSlice";
import {
  setDarkMode,
  setConnected,
  addToast,
  removeToast,
} from "./redux/slices/uiSlice";
import "./App.css";

// Use current domain for API, fallback to localhost:3000 for development
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000");

const App = () => {
  const dispatch = useDispatch();
  
  // Select from Redux store
  const measurements = useSelector(state => state.measurements.items);
  const limit = useSelector(state => state.measurements.limit);
  const timeRange = useSelector(state => state.filters.timeRange);
  const sortOrder = useSelector(state => state.filters.sortOrder);
  const selectedDevices = useSelector(state => state.filters.selectedDevices);
  const selectedSensors = useSelector(state => state.filters.selectedSensors);
  const isDarkMode = useSelector(state => state.ui.isDarkMode);
  const connected = useSelector(state => state.ui.connected);
  const toasts = useSelector(state => state.ui.toasts);
  const authToken = useSelector(state => state.auth.token);
  const authUser = useSelector(state => state.auth.user);
  const adminMode = useSelector(state => state.auth.adminMode);

  // Filter measurements by selected devices and sensors
  const filteredMeasurements = useMemo(() => {
    if (selectedDevices.length === 0 && selectedSensors.length === 0) {
      return measurements;
    }
    
    return measurements.filter(item => {
      const deviceMatch = selectedDevices.length === 0 || selectedDevices.includes(item.device);
      const sensorMatch = selectedSensors.length === 0 || selectedSensors.includes(item.sensor);
      return deviceMatch && sensorMatch;
    });
  }, [measurements, selectedDevices, selectedSensors]);

  const parsedMeasurements = useMemo(
    () =>
      filteredMeasurements.map((item) => {
        let payload = item.payload;

        if (typeof payload === "string") {
          try {
            payload = JSON.parse(payload);
          } catch {
            payload = { raw: payload };
          }
        }

        return {
          ...item,
          payload,
        };
      }),
    [filteredMeasurements]
  );

  // Prepare chart data
  const chartData = useMemo(
    () =>
      [...parsedMeasurements].reverse().map((item) => ({
        time: new Date(item.received_at).toLocaleTimeString(),
        timestamp: new Date(item.received_at).getTime(),
        temperature: parseFloat(item.payload?.temperature) || 0,
        humidity: parseFloat(item.payload?.humidity) || 0,
      })),
    [parsedMeasurements]
  );

  const latest = parsedMeasurements[0];

  // Get unique devices and sensors for filter UI
  const uniqueDevices = useMemo(
    () => [...new Set(measurements.map(m => m.device))],
    [measurements]
  );

  const uniqueSensors = useMemo(
    () => [...new Set(measurements.map(m => m.sensor))],
    [measurements]
  );

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Load initial measurement history
  useEffect(() => {
    const params = new URLSearchParams({
      device: "esp32-dht11",
      limit,
      offset: 0,
      sort: sortOrder,
      timeRange,
    });

    fetch(`${SOCKET_URL}/api/v1/iot/data?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          dispatch(setMeasurements(data));
        }
      })
      .catch((err) => console.error("Failed to load measurements:", err));
  }, [timeRange, sortOrder, limit, dispatch]);

  // Connect WebSocket
  useEffect(() => {
    const webSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    webSocket.on("connect", () => dispatch(setConnected(true)));
    webSocket.on("disconnect", () => dispatch(setConnected(false)));
    webSocket.on("measurement", (data) => {
      dispatch(addMeasurement(data));
      const payload = typeof data.payload === "string" ? JSON.parse(data.payload) : data.payload;
      dispatch(
        addToast({
          message: `New measurement: ${payload?.temperature}°C`,
          type: "info",
        })
      );
    });

    return () => webSocket.close();
  }, [dispatch]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    dispatch(logout());
    window.location.href = window.location.href;
  };

  // Handle login success
  const handleLoginSuccess = (data) => {
    if (typeof data === 'string') {
      // Old format - just user object
      const token = localStorage.getItem("authToken");
      dispatch(
        loginSuccess({
          token,
          user: data,
        })
      );
    } else {
      // New format - object with token and user
      dispatch(
        loginSuccess({
          token: data.token,
          user: data.user,
        })
      );
    }
  };

  // Show admin panel if admin mode is active
  if (adminMode && authToken && authUser?.role === "admin") {
    return (
      <AdminPanel
        user={authUser}
        token={authToken}
        onLogout={handleLogout}
        SOCKET_URL={SOCKET_URL}
      />
    );
  }

  // Show login if not authenticated
  if (!authToken) {
    return <Login onLoginSuccess={handleLoginSuccess} SOCKET_URL={SOCKET_URL} />;
  }

  return (
    <div className={`dashboard ${isDarkMode ? "dark" : "light"}`}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch(removeToast(toast.id))}
        />
      ))}

      <header className="hero">
        <div>
          <p className="eyebrow">ESP32 + DHT11</p>
          <h1>Live climate dashboard</h1>
          <p className="subtitle">Temperature and humidity stream from your home sensor to the backend in real time.</p>
        </div>

        <div className="header-controls">
          <button 
            className="theme-toggle" 
            onClick={() => dispatch(setDarkMode(!isDarkMode))}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          
          {authUser?.role === "admin" && (
            <button
              className="admin-btn"
              onClick={() => dispatch(setAdminMode(!adminMode))}
              title="Admin Panel"
            >
              ⚙️ Admin
            </button>
          )}

          {authToken && (
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              title="Logout"
            >
              Logout
            </button>
          )}

          <div className={`status-pill ${connected ? "online" : "offline"}`}>
            {connected ? "LIVE" : "DISCONNECTED"}
          </div>
        </div>
      </header>

      <section className="filters">
        <div className="filter-group">
          <label>Time Range</label>
          <select value={timeRange} onChange={(e) => dispatch(setTimeRange(e.target.value))}>
            <option value="all">All Time</option>
            <option value="lastHour">Last Hour</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort Order</label>
          <select value={sortOrder} onChange={(e) => dispatch(setSortOrder(e.target.value))}>
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Limit Results</label>
          <select value={limit} onChange={(e) => dispatch(setLimit(parseInt(e.target.value)))}>
            <option value={10}>10 items</option>
            <option value={25}>25 items</option>
            <option value={50}>50 items</option>
            <option value={100}>100 items</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Devices</label>
          <div className="checkbox-group">
            {uniqueDevices.map(device => (
              <label key={device} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedDevices.includes(device)}
                  onChange={() => {
                    const newDevices = selectedDevices.includes(device)
                      ? selectedDevices.filter(d => d !== device)
                      : [...selectedDevices, device];
                    dispatch(setSelectedDevices(newDevices));
                  }}
                />
                {device}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Sensors</label>
          <div className="checkbox-group">
            {uniqueSensors.map(sensor => (
              <label key={sensor} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedSensors.includes(sensor)}
                  onChange={() => {
                    const newSensors = selectedSensors.includes(sensor)
                      ? selectedSensors.filter(s => s !== sensor)
                      : [...selectedSensors, sensor];
                    dispatch(setSelectedSensors(newSensors));
                  }}
                />
                {sensor}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="metrics">
        <article className="metric-card warm">
          <span>Temperature</span>
          <strong>{latest?.payload?.temperature ?? "--"}</strong>
          <small>°C</small>
        </article>

        <article className="metric-card cool">
          <span>Humidity</span>
          <strong>{latest?.payload?.humidity ?? "--"}</strong>
          <small>%</small>
        </article>

        <article className="metric-card deep">
          <span>Device</span>
          <strong>{latest?.device ?? "--"}</strong>
          <small>{latest?.sensor ?? "dht11"}</small>
        </article>
      </section>

      <section className="charts">
        <h2>Historical data</h2>
        <div className="chart-grid">
          <div className="chart-container">
            <h3>Temperature over time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#ddd"} />
                <XAxis dataKey="time" stroke={isDarkMode ? "#888" : "#666"} style={{ fontSize: "12px" }} />
                <YAxis stroke={isDarkMode ? "#888" : "#666"} style={{ fontSize: "12px" }} label={{ value: "°C", angle: -90, position: "insideLeft" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? "#222" : "#fff", border: `1px solid ${isDarkMode ? "#ff6b35" : "#e0552b"}`, color: isDarkMode ? "#fff" : "#1a1a2e" }}
                  labelStyle={{ color: isDarkMode ? "#fff" : "#1a1a2e" }}
                  cursor={{ stroke: isDarkMode ? "#ff6b35" : "#e0552b" }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke={isDarkMode ? "#ff6b35" : "#e0552b"} 
                  dot={false}
                  strokeWidth={2}
                  name="Temperature (°C)"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Humidity over time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#ddd"} />
                <XAxis dataKey="time" stroke={isDarkMode ? "#888" : "#666"} style={{ fontSize: "12px" }} />
                <YAxis stroke={isDarkMode ? "#888" : "#666"} style={{ fontSize: "12px" }} label={{ value: "%", angle: -90, position: "insideLeft" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? "#222" : "#fff", border: `1px solid ${isDarkMode ? "#4fb3d9" : "#1a6fb5"}`, color: isDarkMode ? "#fff" : "#1a1a2e" }}
                  labelStyle={{ color: isDarkMode ? "#fff" : "#1a1a2e" }}
                  cursor={{ stroke: isDarkMode ? "#4fb3d9" : "#1a6fb5" }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke={isDarkMode ? "#4fb3d9" : "#1a6fb5"} 
                  dot={false}
                  strokeWidth={2}
                  name="Humidity (%)"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="feed">
        <div className="feed-header">
          <h2>Recent measurements</h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <p>{parsedMeasurements.length} stored readings</p>
            <button
              className="export-btn"
              onClick={() => {
                exportToCSV(parsedMeasurements, `measurements_${new Date().toISOString().slice(0, 10)}.csv`);
                dispatch(addToast({
                  message: "Data exported to CSV",
                  type: "success",
                }));
              }}
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        <div className="timeline">
          {parsedMeasurements.map((item) => (
            <article className="timeline-item" key={`${item.received_at}-${item.device}`}>
              <div className="timeline-time">{new Date(item.received_at).toLocaleString()}</div>
              <div className="timeline-body">
                <div>
                  <strong>{item.device}</strong>
                  <p>{item.sensor}</p>
                </div>
                <div className="payload-grid">
                  <span>Temp: {item.payload?.temperature ?? item.payload?.raw ?? "--"}</span>
                  <span>Humidity: {item.payload?.humidity ?? "--"}</span>
                  <span>Measured: {item.payload?.measured_at ?? item.received_at}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
