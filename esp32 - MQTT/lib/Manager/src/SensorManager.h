#pragma once

#include <string>

class SensorManager {
public:
    explicit SensorManager();

    std::string measure() const;
};
