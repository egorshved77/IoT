#pragma once

#include <Arduino.h>

class DiodeManager {
  public:
      explicit DiodeManager();

      void setup();

      void setOn();
      void setOff();
      
  private:
    static constexpr uint8_t DIODE_PIN = 2;
};