#include "DiodeManagerRGB.h"

DiodeManagerRGB::DiodeManagerRGB(): _pixels(NUM_PIXELS, RGB_PIN, NEO_RGB + NEO_KHZ800) {}

void DiodeManagerRGB::setup() {
  _pixels.begin();
  _pixels.setBrightness(10);

  setYellow();
}

void DiodeManagerRGB::setOff() {
  _pixels.clear();
  _pixels.show();
}

void DiodeManagerRGB::applyColor(uint8_t r, uint8_t g, uint8_t b) {
  _pixels.setPixelColor(0, _pixels.Color(r, g, b));
  _pixels.show();
}

void DiodeManagerRGB::setYellow() {
  applyColor(255, 255, 0);
}

void DiodeManagerRGB::setGreen() {
  applyColor(0, 255, 0);
}

void DiodeManagerRGB::setBlue() {
  applyColor(0, 0, 255);
}

void DiodeManagerRGB::setRed() {
  applyColor(255, 0, 0);
}