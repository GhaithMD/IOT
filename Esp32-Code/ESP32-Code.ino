#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include "DHT.h"

#define DHTPIN 32    // GPIO pin connected to DHT11
#define DHTTYPE DHT11

// Wi-Fi credentials
const char* ssid = "ssid";           // Replace with your Wi-Fi network name
const char* password = "password";    // Replace with your Wi-Fi password
const char* serverUrl = "serverUrl";

// Root CA Certificate (replace with your server's certificate)
const char* rootCACertificate = \
"-----BEGIN CERTIFICATE-----\n"
"-----END CERTIFICATE-----\n";


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

  // Create a WiFiClientSecure for HTTPS
  WiFiClientSecure client;
  client.setCACert(rootCACertificate); // Use the root CA certificate for secure connection

  // Send data to the gateway
  HTTPClient http;
  http.begin(client, serverUrl);
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
