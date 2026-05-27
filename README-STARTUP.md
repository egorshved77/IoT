# IoT Climate Dashboard - Quick Start Guide

## 🚀 Быстрый запуск (одна команда!)

### Вариант 1: Запустить всё сразу (рекомендуется)
```bash
cd /home/yahor/Desktop/IoT/PWr_IoT_2026
./start-all.sh
```

Это запустит:
- ✅ MySQL Database (Docker)
- ✅ MQTT Broker (Docker)
- ✅ Backend (Node.js на порту 3000)
- ✅ Frontend (React на порту 5173)

Потом откройте браузер на **http://localhost:5173**

---

## 📝 Важно при смене сети (университет, другое место)

Когда вы придёте в университет, IP адрес измениться! Нужно обновить две строчки:

### 1. Скрипт `start-all.sh`
Строка 28, измените IP:
```bash
# Текущая строка:
DB_ENGINE=mysql MQTT_ENABLED=true MQTT_HOST=192.168.31.233 npm start &

# На новый IP, например 10.0.0.5:
DB_ENGINE=mysql MQTT_ENABLED=true MQTT_HOST=10.0.0.5 npm start &
```

### 2. Backend конфигурация (для REST)
Файл: `2 - backend/src/modules/iot/iot.controller.mqtt.js`

Если нужно, измените:
```javascript
const mqtt_host = process.env.MQTT_HOST ?? "localhost";
```

---

## 🔧 Если что-то не работает

### Остановить все сервисы
```bash
pkill -f "node src/server.js"
pkill -f "vite"
pkill -f "docker"
```

### Запустить вручную (если скрипт не работает)
```bash
# Терминал 1 - Docker
cd "4 - db" && docker-compose up

# Терминал 2 - MQTT
cd "5 - mqtt" && docker-compose up

# Терминал 3 - Backend
cd "2 - backend" && DB_ENGINE=mysql MQTT_ENABLED=true MQTT_HOST=192.168.31.233 npm start

# Терминал 4 - Frontend
cd "3 - frontend" && npm run dev
```

---

## 📊 Что вы увидите

- **Frontend**: http://localhost:5173 или http://esp32.local:3000
  - Два графика (Температура и Влажность)
  - Последние измерения
  - Статус подключения (LIVE/DISCONNECTED)

- **Backend**: http://localhost:3000
  - REST API на `/api/v1/iot/data`
  - WebSocket для real-time обновлений

- **PhpMyAdmin**: http://localhost:3307
  - Просмотр БД (логин: system, пароль: supersecret_system)

- **MQTT Dashboard**: http://localhost:8081
  - Просмотр MQTT топиков

---

## 💡 Как работает mDNS

ESP32 доступен как **esp32.local** в любой сети:
- Дома: esp32.local
- В университете: esp32.local
- Везде: esp32.local ✅

Это работает благодаря mDNS протоколу (как Bonjour в Apple)

---

## 🎯 Architecture

```
ESP32 (DHT11 сенсор на GPIO 4)
    ↓ WiFi (2.4GHz)
MQTT Broker (Mosquitto, Docker:1883)
    ↓
Backend (Node.js, Express:3000)
    ├─ MySQL (Database:3306)
    ├─ MQTT Subscription
    └─ WebSocket Broadcasting
        ↓
React Frontend (Vite:5173)
    ├─ Real-time Charts
    ├─ Live Dashboard
    └─ Historical Data
```

Приятного использования! 🚀
