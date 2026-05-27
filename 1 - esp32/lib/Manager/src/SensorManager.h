#pragma once

#include <string>
#include <cstdint>

class SensorManager {
public:
    explicit SensorManager(uint8_t pin = 4);

    void setup();
    std::string measure() const;

private:
    uint8_t _pin;
};
