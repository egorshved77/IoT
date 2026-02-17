#include "DiodeManager.h"

DiodeManager::DiodeManager(): _pixels(NUM_PIXELS, RGB_PIN, NEO_RGB + NEO_KHZ800) {}

void DiodeManager::setup() {
  _pixels.begin();
  _pixels.setBrightness(10);

  setYellow();
}

void DiodeManager::setOff() {
  _pixels.clear();
  _pixels.show();
}

void DiodeManager::applyColor(uint8_t r, uint8_t g, uint8_t b) {
  _pixels.setPixelColor(0, _pixels.Color(r, g, b));
  _pixels.show();
}

void DiodeManager::setYellow() {
  applyColor(255, 255, 0);
}

void DiodeManager::setGreen() {
  applyColor(0, 255, 0);
}

void DiodeManager::setBlue() {
  applyColor(0, 0, 255);
}

void DiodeManager::setRed() {
  applyColor(255, 0, 0);
}