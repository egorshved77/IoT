#include <Arduino.h>
#include <WiFi.h>
#include <string>

#include "ServerManager.h"
#include "DiodeManager.h"
#include "SensorManager.h"

SensorManager sensor;
ServerManager server;
DiodeManager diode;

void setup() {
  diode.setup();

  Serial.begin(115200);

  while (!Serial) { 
    delay(10); 
  }
  
  delay(10000);

  server.setDataProvider([]() -> std::string { 
    return sensor.measure(); 
  });
}

void loop() {

  Serial.println("Configuration mode...");
  diode.setBlue();

  server.startAP();

  while (server.loopAP()) {
    yield();
  };

  server.stopAP();

  Serial.println("Production mode...");
  diode.setGreen();

  server.startSTA();

  while (true) {
    server.loopSTA();
  }
}