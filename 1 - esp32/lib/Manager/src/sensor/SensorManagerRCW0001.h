#pragma once
#include "ISensorManager.h"
#include <Arduino.h>

class SensorManagerRCW0001 : public ISensorManager {
public:
    explicit SensorManagerRCW0001(uint8_t trigPin, uint8_t echoPin);

    void setup() override;
    std::string measure() const override;

private:
    uint8_t _trigPin;
    uint8_t _echoPin;
};