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
  Serial.begin(115200);

  Serial.println("Booting ESP32 DHT11 firmware...");

  diode.setup();
  diodeRGB.setup();
  sensor.setup();

  delay(10000);

  server.setDataProvider([]() -> std::string { 
    std::string value = sensor.measure();
    Serial.printf("Sensor payload: %s\n", value.c_str());
    return value;
  });
}

void loop() {

  Serial.println("Configuration mode...");
  diodeRGB.setOff();
  diode.setOff();

  server.startAP();

  while (server.loopAP()) {
    yield();
  };

  server.stopAP();

  Serial.println("Production mode...");
  
  server.startSTA(true);

  // Turn on blue LED for WiFi connected status
  diodeRGB.setBlue();
  diode.setOn();

  while (true) {
    server.loopMqttSTA();
  }
}