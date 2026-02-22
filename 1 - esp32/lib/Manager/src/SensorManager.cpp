#include "SensorManager.h"
#include <Arduino.h>

SensorManager::SensorManager() {}

std::string SensorManager::measure() const {
    
  return std::to_string(esp_random() % 100);
}
