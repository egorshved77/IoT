#pragma once

#include <Adafruit_NeoPixel.h>

class DiodeManagerRGB {
  public:
      explicit DiodeManagerRGB();
      
      void setup();

      void setOff();

      void setYellow();
      void setGreen();
      void setBlue();
      void setRed();

  private:
    void applyColor(uint8_t r, uint8_t g, uint8_t b);

    static constexpr uint8_t RGB_PIN = 5;  // Changed from 38 (unavailable) to 5
    static constexpr uint16_t NUM_PIXELS = 1;

    Adafruit_NeoPixel _pixels;
};