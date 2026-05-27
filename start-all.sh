#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Kill any existing processes
echo -e "${YELLOW}Stopping any existing processes...${NC}"
pkill -f "node src/server.js" || true
pkill -f "vite" || true
sleep 1

# Start Docker services (DB and MQTT)
echo -e "\n${YELLOW}Starting Docker services (Database & MQTT)...${NC}"
cd "4 - db"
docker-compose up -d
cd ..

cd "5 - mqtt"
docker-compose up -d
cd ..

echo -e "${GREEN}✓ Docker services started${NC}"
sleep 3

# Start Backend
echo -e "\n${YELLOW}Starting Backend (Node.js)...${NC}"
cd "2 - backend"
nohup bash -c 'DB_ENGINE=mysql MQTT_ENABLED=true MQTT_HOST=192.168.31.233 npm start' > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
sleep 3

# Start Frontend
echo -e "\n${YELLOW}Starting Frontend (React/Vite)...${NC}"
cd "3 - frontend"
nohup bash -c 'npm run dev' > frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

echo -e "${GREEN}Database:${NC}   MySQL @ localhost:3306"
echo -e "${GREEN}MQTT:${NC}       Mosquitto @ localhost:1883"
echo -e "${GREEN}Backend:${NC}    http://localhost:3000"
echo -e "${GREEN}Frontend:${NC}   http://localhost:5173${NC}"
echo -e "${YELLOW}View logs:${NC}"
echo -e "  Backend:  tail -f 2\ -\ backend/backend.log"
echo -e "  Frontend: tail -f 3\ -\ frontend/frontend.log"
echo -e "\n${YELLOW}Stop all:${NC} pkill -f 'npm start'; pkill -f 'vite'${NC}"


echo -e "${GREEN}✓ All services started in background!${NC}"
echo -e "${YELLOW}Opening http://localhost:5173 in 5 seconds...${NC}\n"

sleep 5
xdg-open http://localhost:5173 2>/dev/null || open http://localhost:5173 2>/dev/null || echo "Open http://localhost:5173 manually"

