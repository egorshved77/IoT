#include <Arduino.h>
#include <WiFi.h>
#include <string>

#include "DiodeManager.h"
#include "diode/DiodeManagerRGB.h"
#include "ServerManager.h"
#include "SensorManager.h"

DiodeManager diode;
DiodeManagerRGB diodeRGB;
ServerManager server;
SensorManager sensor;

void setup() {
  diodeRGB.setup();           // diode.setup();
  sensor.setup();

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
  diodeRGB.setBlue();         // diode.setOn();

  server.startAP();

  while (server.loopAP()) {
    yield();
  };

  server.stopAP();

  Serial.println("Production mode...");
  diodeRGB.setGreen();        // diode.setOff();

  server.startSTA(true);

  while (true) {
    server.loopMqttSTA();
  }
}