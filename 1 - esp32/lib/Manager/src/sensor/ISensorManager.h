#pragma once
#include <string>

class ISensorManager {
public:
    virtual ~ISensorManager() = default;

    virtual void setup() = 0;
    virtual std::string measure() const = 0;
};