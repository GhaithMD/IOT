#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

#define DHTPIN 32    // GPIO pin connected to DHT11
#define DHTTYPE DHT11

// Wi-Fi credentials
const char* ssid = "TOPNET_FD90";           // Replace with your Wi-Fi network name
const char* password = "Feres20011996";   // Replace with your Wi-Fi password
const char* serverUrl = "http://192.168.1.20:8080/receive-data";

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Send data to the gateway
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  String jsonData = String("{\"temperature\":") + temperature + 
                  String(",\"humidity\":") + humidity + String("}");
  int httpResponseCode = http.POST(jsonData);
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.println("Error sending data");
  }
  http.end();

  delay(10000); // Send data every 10 seconds
}