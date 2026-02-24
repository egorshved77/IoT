#pragma once

#include <string>

class SensorManager {
public:
    explicit SensorManager();

    void setup();
    std::string measure() const;
};
