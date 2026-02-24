#include "SensorManager.h"
#include <Arduino.h>

SensorManager::SensorManager() {}

void SensorManager::setup() {}

std::string SensorManager::measure() const {
    
  return std::to_string(esp_random() % 100);
}
