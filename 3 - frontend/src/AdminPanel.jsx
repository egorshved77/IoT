import { useState } from "react";
import "./AdminPanel.css";

const AdminPanel = ({ user, token, onLogout, SOCKET_URL }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSeed = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${SOCKET_URL}/api/v1/admin/seed`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to seed database");

      const data = await response.json();
      setMessage(data.message);
      setMessageType("success");
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handlePurge = async () => {
    if (!window.confirm("Are you sure? This will delete ALL measurements!")) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${SOCKET_URL}/api/v1/admin/purge`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to purge database");

      const data = await response.json();
      setMessage(data.message);
      setMessageType("success");
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.username}!</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="admin-content">
        <section className="admin-section">
          <div className="section-header">
            <h2>Database Management</h2>
            <p>Manage your measurement data</p>
          </div>

          <div className="admin-actions">
            <div className="action-card">
              <h3>📊 Seed Database</h3>
              <p>Generate 288 mock measurements for the last 24 hours with realistic sensor data.</p>
              <button
                onClick={handleSeed}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Processing..." : "Seed Data"}
              </button>
            </div>

            <div className="action-card danger">
              <h3>🗑️ Purge Database</h3>
              <p>Delete all measurements from the database. This action cannot be undone!</p>
              <button
                onClick={handlePurge}
                disabled={loading}
                className="btn btn-danger"
              >
                {loading ? "Processing..." : "Purge All Data"}
              </button>
            </div>
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {messageType === "success" ? "✓" : "✗"} {message}
            </div>
          )}
        </section>

        <section className="admin-section">
          <div className="section-header">
            <h2>System Information</h2>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <span>Logged in as:</span>
              <strong>{user.username}</strong>
            </div>
            <div className="info-card">
              <span>User role:</span>
              <strong>{user.role}</strong>
            </div>
            <div className="info-card">
              <span>Backend URL:</span>
              <strong>{SOCKET_URL}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
