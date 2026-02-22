#include "ServerManager.h"
#include "webpage/MainPageAP.h"
#include <HTTPClient.h>
#include <WiFi.h>

ServerManager::ServerManager() : _server(80), _mqttClient(_wifiClient) {}               // Modified

// ------------------------------------------------------------------------

void ServerManager::setDataProvider(std::function<std::string()> callback) {
    _data_provider = callback;
}

std::string ServerManager::parseDataToJson(const std::string& payload) {
    return "{\"device\": \"" + _device + "\", \"sensor\": \"" + _sensor + "\", \"payload\": \"" + payload + "\"}";
}

void ServerManager::sendPostRequest(const std::string& body) {

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Error: WiFi Disconnected.");
        return;
    }

    HTTPClient http;

    http.begin(_url_rest.c_str());
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(body.c_str());

    if (httpResponseCode > 0) {
        std::string response = http.getString().c_str();
        Serial.printf("HTTP Response code: %d\n", httpResponseCode);
        Serial.println(response.c_str());
    } else {
        Serial.printf("Error code: %d\n", httpResponseCode);
    }
 
    http.end();
}

void ServerManager::sendMqttMessage(const std::string& body) {                          // Added

    if (_mqttClient.publish(_mqtt_topic.c_str(), body.c_str())) {
        Serial.println("MQTT message published.");
    } else {
        Serial.println("MQTT message error.");
    }
}

// ------------------------------------------------------------------------

void ServerManager::startAP() {
    WiFi.softAPdisconnect(true);

    WiFi.softAP(_ap_ssid.c_str(), _ap_password.c_str());

    _server.on("/", [this]() { 
        _server.send(200, "text/html", CONFIG_PAGE);
    });

    _server.on("/save", HTTP_POST, [this]() {
        if (_server.hasArg("ssid") && _server.hasArg("password")) {
            _sta_ssid = _server.arg("ssid").c_str();
            _sta_password = _server.arg("password").c_str();

            _server.send(200, "text/plain", "Credentials received.");
        } else {
            _server.send(400, "text/plain", "Invalid credentials");
        }
    });

    _server.begin();

    Serial.println("Access Point created.");

    Serial.printf("SSID    : %s\n", _ap_ssid.c_str());
    Serial.printf("Address : http://%s\n", WiFi.softAPIP().toString().c_str());
}

void ServerManager::stopAP() {
    _server.stop();

    WiFi.softAPdisconnect(true);

    Serial.printf("Access Point terminated.\n");
}

// ------------------------------------------------------------------------

void ServerManager::startSTA() {                                                        // Modified
    WiFi.mode(WIFI_STA); 

    delay(100);

    WiFi.begin(_sta_ssid.c_str(), _sta_password.c_str());

    Serial.print("Connecting to network.");

    int retry = 0;
    while (WiFi.status() != WL_CONNECTED && retry++ < 20) {
        delay(500);
        Serial.print(".");
    }

    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
        Serial.print("Connection established (network).\n");
    } else {
        Serial.print("Connection failed (network). Rebooting...\n");

        delay(5000);
        
        ESP.restart();
    }

    _mqttClient.setServer(_mqtt_broker.c_str(), _mqtt_port);                           
}

void ServerManager::connectToMqtt() {                                                   // Added

    while (!_mqttClient.connected()) {
        Serial.println("Connecting to MQTT.");

        if (_mqttClient.connect(_device.c_str())) {
            Serial.println("Connection established (MQTT).");
        } else {
            Serial.print("Connection failed (MQTT). State: ");
            Serial.print(_mqttClient.state());
            Serial.print("\n");
            
            delay(5000); 
        }
    }
}

// ------------------------------------------------------------------------

bool ServerManager::loopAP() {
    _server.handleClient();

    return _sta_ssid.empty() || _sta_password.empty();
}

void ServerManager::loopSTA() {                                                         // Modified

    if (!_mqttClient.connected()) {
        connectToMqtt();
    }

    _mqttClient.loop();

    unsigned long currentMillis = millis();
    if (currentMillis - _last_publish_time >= _delay_ms) {
        _last_publish_time = currentMillis;

        if (_data_provider) {
            std::string jsonBody = parseDataToJson(_data_provider());
            sendMqttMessage(jsonBody);
            sendPostRequest(jsonBody);
        } else {
            Serial.println("Warning: No Data Provider set!");
        }
    }
}