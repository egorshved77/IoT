#include "ServerManager.h"
#include "webpage/MainPageAP.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <ESPmDNS.h>
#include <time.h>

ServerManager::ServerManager() : _server(80), _client_mqtt(_client_wifi) {}

// ------------------------------------------------------------------------

void ServerManager::setDataProvider(std::function<std::string()> callback) {
    _data_provider = callback;
}

std::string ServerManager::parseDataToJson(const std::string& payload) {
    JsonDocument document;
    document["device"] = _device.c_str();
    document["sensor"] = _sensor.c_str();
    document["received_at"] = getTimestamp().c_str();
    document["payload"] = payload.c_str();

    String output;
    serializeJson(document, output);

    return std::string(output.c_str());
}

void ServerManager::syncTime() {
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");

    struct tm timeinfo;
    for (int retry = 0; retry < 20; retry++) {
        if (getLocalTime(&timeinfo)) {
            Serial.println("NTP time synchronized.");
            return;
        }

        delay(500);
    }

    Serial.println("Warning: NTP time synchronization failed.");
}

std::string ServerManager::getTimestamp() const {
    struct tm timeinfo;

    if (!getLocalTime(&timeinfo)) {
        return "unknown";
    }

    char buffer[32];
    strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);

    return std::string(buffer);
}

void ServerManager::sendPostRequest(const std::string& body) {
    HTTPClient http;

    http.begin(_url_rest.c_str());
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(body.c_str());

    if (httpResponseCode > 0) {
        std::string response = http.getString().c_str();
        Serial.printf("HTTP Response code: %d\n", httpResponseCode);
    } else {
        Serial.printf("Error code: %d\n", httpResponseCode);
    }
 
    http.end();
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

void ServerManager::startSTA(bool initMqtt) {
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
        
        // Initialize mDNS (make ESP32 accessible as esp32.local)
        if (MDNS.begin("esp32")) {
            Serial.println("mDNS responder started. Access via: http://esp32.local");
        } else {
            Serial.println("Error starting mDNS responder!");
        }
    } else {
        Serial.print("Connection failed (network). Rebooting...\n");

        delay(5000);
        
        ESP.restart();
    }

    syncTime();

    if (initMqtt) {
        _client_mqtt.setServer(_mqtt_broker.c_str(), _mqtt_port);                           
    }
}

// ------------------------------------------------------------------------

bool ServerManager::loopAP() {
    _server.handleClient();

    return _sta_ssid.empty() || _sta_password.empty();
}

void ServerManager::loopRestSTA() {
    delay(_delay_ms);

    if (_data_provider) {
        std::string jsonBody = parseDataToJson(_data_provider());
        sendPostRequest(jsonBody);
    } else {
        Serial.println("Warning: No Data Provider set!");
    }
}

// ------------------------------------------------------------------------

void ServerManager::connectToMqtt() {

    while (!_client_mqtt.connected()) {
        Serial.println("Connecting to MQTT.");

        if (_client_mqtt.connect(_device.c_str())) {
            Serial.println("Connection established (MQTT).");
        } else {
            Serial.print("Connection failed (MQTT). State: ");
            Serial.print(_client_mqtt.state());
            Serial.print("\n");
            
            delay(5000); 
        }
    }
}

void ServerManager::sendMqttMessage(const std::string& body) {

    if (_client_mqtt.publish(_mqtt_topic.c_str(), body.c_str())) {
        Serial.println("MQTT message published.");
    } else {
        Serial.println("MQTT message error.");
    }
}

void ServerManager::loopMqttSTA() {

    if (!_client_mqtt.connected()) {
        connectToMqtt();
    }

    _client_mqtt.loop();

    _current_time = millis();
    if (_current_time - _last_publish_time >= _delay_ms) {
        _last_publish_time = _current_time;

        if (_data_provider) {
            std::string jsonBody = parseDataToJson(_data_provider());
            sendMqttMessage(jsonBody);
        } else {
            Serial.println("Warning: No Data Provider set!");
        }
    }
}