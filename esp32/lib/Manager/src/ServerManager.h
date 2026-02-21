#pragma once

#include <Arduino.h>
#include <WebServer.h>
#include <string>
#include <functional>

class ServerManager {
    public:
    explicit ServerManager();

    void setDataProvider(std::function<std::string()> callback);
    
    void startAP();
    void stopAP();

    void startSTA();

    bool loopAP();
    void loopSTA();

private:
    WebServer _server;

    std::string parseDataToJson(const std::string& data);
    void sendPostRequest(const std::string& body);
    void configureEndpointAP();

    std::string _url = "http://10.216.158.124:3000/api/v1/iot/data";
    std::string _device = "d_123";
    std::string _sensor = "random";

    std::string _ap_ssid = "esp32";
    std::string _ap_password = "supersecret";

    std::string _sta_ssid = "";
    std::string _sta_password = "";

    unsigned long _delay_ms = 5000;

    std::function<std::string()> _data_provider;
};
