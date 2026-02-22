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
    bool loopAP();
    void stopAP();

    void startSTA(bool initMqtt);
    void loopRestSTA();

    // ------------------------------------------------------------------------

    void loopMqttSTA();

private:
    std::string parseDataToJson(const std::string& data);
    void sendPostRequest(const std::string& body);
    
    WebServer _server;

    std::function<std::string()> _data_provider;

    std::string _url_rest = "http://10.216.158.124:3000/api/v1/iot/data";

    std::string _device = "d_123";
    std::string _sensor = "random";

    std::string _ap_ssid = "esp32";
    std::string _ap_password = "supersecret";

    std::string _sta_ssid = "";
    std::string _sta_password = "";

    unsigned long _delay_ms = 5000;

    // ------------------------------------------------------------------------

    void connectToMqtt();
    void sendMqttMessage(const std::string& body);

    WiFiClient _client_wifi;
    PubSubClient _client_mqtt;

    std::string _mqtt_broker = "10.216.158.124";
    std::string _mqtt_topic = "iot/data";
    int _mqtt_port = 1883; 

    unsigned long _current_time = 0;
    unsigned long _last_publish_time = 0;
};
