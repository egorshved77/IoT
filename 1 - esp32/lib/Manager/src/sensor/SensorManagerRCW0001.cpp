#include "SensorManagerRCW0001.h"
#include <stdio.h>

SensorManagerRCW0001::SensorManagerRCW0001(uint8_t trigPin, uint8_t echoPin) : _trigPin(trigPin), _echoPin(echoPin) {}

void SensorManagerRCW0001::setup() {
    pinMode(_trigPin, OUTPUT);
    pinMode(_echoPin, INPUT);
    digitalWrite(_trigPin, LOW);
}

std::string SensorManagerRCW0001::measure() const {
    digitalWrite(_trigPin, LOW);
    delayMicroseconds(2);

    noInterrupts();

    digitalWrite(_trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(_trigPin, LOW);

    long duration = pulseIn(_echoPin, HIGH, 30000); 

    interrupts();
    
    if (duration == 0) {
        return "-1.000"; 
    }

    float distance = (duration * 0.34) / 2.0;

    char buffer[16];
    snprintf(buffer, sizeof(buffer), "%.1f", distance);

    return std::string(buffer);
}