# Evaluation Matrix

## Module 1: Hardware & Firmware (ESP32)

**Access Point (AP) Features**
* 0.1 - Configure a custom IP address for the Access Point (e.g., 10.0.0.1).
* 0.2 - Implement a DNS server to create a captive portal for immediate user routing.
* 0.3 - Add a manual measurement trigger button to the AP web interface.
* 0.4 - Deploy a dedicated embedded web server to host a static configuration page.
* 0.5 - Secure the Access Point with TLS encryption using a custom certificate.

**Station (STA) Features**
* 0.2 - Store Wi-Fi credentials persistently to survive reboots and bypass AP mode.
* 0.2 - Implement dynamic fallback to AP mode if the STA Wi-Fi connection drops during runtime.
* 0.3 - Develop a web dashboard with configuration options for STA mode.

**System Operations**
* 0.2 - Implement a physical hardware reset mechanism.
* 0.3 - Append timestamps to the data payloads. Synchronize system time via NTP (Network Time Protocol) for timestamp generation.
* 0.3 - Implement the SensorManager class to abstract sensor readings.
* 0.3 - Implement the SerialManager class to abstract UART communications.
* 0.3 - Replace manual JSON string concatenation in ServerManager with a dedicated library.
* 0.4 - Integrate a system Watchdog timer to automatically recover from execution hangs.
* 0.4 - Implement Deep Sleep functionality to heavily reduce power consumption.
* 0.4 - Refactor execution flow using a Real-Time Operating System (FreeRTOS) for task scheduling.

## Module 2: Backend API (Node.js & Express)

**Infrastructure & Architecture**
* 0.3 - Containerize the Node.js application environment using Docker.
* 0.3 - Integrate a robust third-party logging framework.

**Data Operations (IoT Endpoints)**
* 0.1 - Implement response limiters (data truncation) via REST query parameters.
* 0.2 - Add ascending/descending sorting capabilities via REST query parameters.
* 0.2 - Implement time-range filtering for measurement data via REST query parameters.
* 0.3 - Implement logical pagination for large datasets via REST query parameters.
* 0.3 - Implement rate limiting for all REST endpoints to prevent API abuse and spam.
* 0.3 - Create a data aggregation endpoint (e.g., calculating the average sensor value per hour).

**Administration & Security**
* 0.2 - Create an administrative endpoint to seed the database with mock measurement data.
* 0.2 - Create an administrative endpoint to safely purge all database records.
* 0.4 - Develop a secure administrative controller protected by password or token authentication.
* 0.4 - Implement middleware to validate JWT authentication tokens.
* 0.4 - Secure the WebSocket connection by verifying JWT tokens during the initial handshake.

## Module 3: Frontend Client (React & Vite)

**Infrastructure & Architecture**
* 0.3 - Containerize the React frontend using Docker.
* 0.3 - Integrate a robust third-party logging framework.
* 0.4 - Serve the compiled static frontend application directly from the Node.js backend.

**Authentication & Security**
* 0.4 - Build a custom token-based or password authentication flow from scratch.
* 0.4 - Develop an exclusive administrative dashboard restricted to authenticated users.
* 0.5 - Integrate OAuth2 for industry-standard identity and access management.

**User Interface & Experience**
* 0.2 - Implement a Dark Mode toggle with local storage persistence across sessions.
* 0.2 - Add toast notifications to alert users of incoming real-time WebSocket events.
* 0.2 - Add an "Export Data" feature allowing users to download current table views as CSV files.
* 0.4 - Replace plain text data lists with visual charting libraries (e.g., Chart.js or Recharts).

**Data Management**
* 0.3 - Implement live filtering to display only specific, user-selected devices from the WebSocket stream.
* 0.3 - Implement live filtering to display only specific, user-selected sensors from the WebSocket stream.
* 0.4 - Implement global state management (e.g., Redux) to efficiently handle high-frequency WebSocket data.