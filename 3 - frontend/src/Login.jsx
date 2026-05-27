import { useState, useEffect } from "react";
import log from "./utils/logger";
import "./Login.css";

const Login = ({ onLoginSuccess, SOCKET_URL }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if redirected from OAuth callback
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(userData));
        log.info(`OAuth login successful: ${userData.email}`);
        onLoginSuccess(userData);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        log.error(`Failed to parse OAuth response: ${err.message}`);
        setError("OAuth login failed. Please try again.");
      }
    }
  }, []); // Empty dependency array - run once on mount

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    log.info(`Login attempt for user: ${username}`);

    try {
      log.debug(`Sending auth request to ${SOCKET_URL}/api/v1/auth/login`);
      const response = await fetch(`${SOCKET_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        log.error(`Login failed: ${response.statusText}`);
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      log.info(`Login successful for user: ${data.user.username}`);
      
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      
      onLoginSuccess({ token: data.token, user: data.user });
    } catch (err) {
      log.error(`Login error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    log.info("Initiating Google OAuth login");
    window.location.href = `${SOCKET_URL}/api/v1/auth/google`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Admin Login</h1>
        <p>Enter your credentials to access the admin panel</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="oauth-btn" onClick={handleGoogleLogin}>
          <span>🔵</span>
          Login with Google
        </button>

        <p className="hint">Default: admin / admin123</p>
      </div>
    </div>
  );
};

export default Login;
