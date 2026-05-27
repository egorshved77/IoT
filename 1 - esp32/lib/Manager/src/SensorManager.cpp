#include "SensorManager.h"
#include <Arduino.h>
#include <DHT.h>

namespace {
constexpr uint8_t DHT_TYPE = DHT11;
}

SensorManager::SensorManager(uint8_t pin) : _pin(pin) {}

void SensorManager::setup() {
  pinMode(_pin, INPUT_PULLUP);
}

std::string SensorManager::measure() const {
  DHT dht(_pin, DHT_TYPE);

  dht.begin();
  delay(2000);

  const float humidity = dht.readHumidity();
  const float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    return "{\"error\":\"dht11_read_failed\"}";
  }

  char buffer[96];
  snprintf(buffer, sizeof(buffer), "{\"temperature\":%.2f,\"humidity\":%.2f}", temperature, humidity);

  return std::string(buffer);
}
