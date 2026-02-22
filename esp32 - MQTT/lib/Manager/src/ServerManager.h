#pragma once

#include <Arduino.h>
#include <WebServer.h>
#include <string>
#include <functional>
#include <WiFiClient.h>
#include <PubSubClient.h>

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

    WiFiClient _wifiClient;
    PubSubClient _mqttClient;

    std::string parseDataToJson(const std::string& data);

    void connectToMqtt();
    void sendPostRequest(const std::string& body);
    void sendMqttMessage(const std::string& body);

    std::string _url_rest = "http://10.216.158.124:3000/api/v1/iot/data";
    std::string _mqtt_broker = "10.216.158.124";
    std::string _mqtt_topic = "iot/measurements";
    int _mqtt_port = 1883; 

    std::string _device = "d_123";
    std::string _sensor = "random";

    std::string _ap_ssid = "esp32";
    std::string _ap_password = "supersecret";

    std::string _sta_ssid = "";
    std::string _sta_password = "";

    unsigned long _delay_ms = 5000;
    unsigned long _last_publish_time = 0;

    std::function<std::string()> _data_provider;
};
