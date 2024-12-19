#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include "DHT.h"

#define DHTPIN 32    // GPIO pin connected to DHT11
#define DHTTYPE DHT11

// Wi-Fi credentials
const char* ssid = "TOPNET_FD90";           // Replace with your Wi-Fi network name
const char* password = "Feres20011996";    // Replace with your Wi-Fi password
const char* serverUrl = "https://192.168.1.20:8443/receive-data";

// Root CA Certificate (replace with your server's certificate)
const char* rootCACertificate = \
"-----BEGIN CERTIFICATE-----\n"
"MIIDmTCCAoGgAwIBAgIUP0NGQfAowIPVuv4Dzmupg1pr2UIwDQYJKoZIhvcNAQEL\n"
"BQAwXDELMAkGA1UEBhMCVE4xEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM\n"
"GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDEVMBMGA1UEAwwMMTkyLjE2OC4xLjIw\n"
"MB4XDTI0MTIxOTExMjkxMloXDTI1MTIxOTExMjkxMlowXDELMAkGA1UEBhMCVE4x\n"
"EzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMg\n"
"UHR5IEx0ZDEVMBMGA1UEAwwMMTkyLjE2OC4xLjIwMIIBIjANBgkqhkiG9w0BAQEF\n"
"AAOCAQ8AMIIBCgKCAQEAqo0/cdCa/+Zr85MjJcrSSGy8aEWj6+h3aN7oGb7+RjD/\n"
"/iY9s6Taf1Bbk1aXbHbWb3nxFzvzhRVJVrk/8LeIPsv+rT3QoDCilK3475YyQw2+\n"
"oryHFDOrxY7PNyHE/oqh+ebXyipPdyeZ6usMqL6b8Za2PHfrQ2YyP1MNq7YK5KIK\n"
"WSpFfs5UcPURH07eVcpOj7pE2K4uSTSuPyPEDyFO3YOmqDkujHfgXlInarJyjFBe\n"
"Jte472xBZceHuXasOxIdb8YC3Nsl6+BjvdrLVzpnin+2inADDkPo2+Q/7wMws0aw\n"
"nOKmRhgZDZeaaU2F0CUjnN1Ap3CP7gWD7mbSYLs8OQIDAQABo1MwUTAdBgNVHQ4E\n"
"FgQU5yOMNaPFjGtEHmT8umcVbmuepHAwHwYDVR0jBBgwFoAU5yOMNaPFjGtEHmT8\n"
"umcVbmuepHAwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEABau3\n"
"H/858fCANmgFIApjdbZmqSze9FCCtw+V0XBnR210nFhiKFWJk8oM7DN7xLMteXMJ\n"
"Osi8QZIx/uDZBit3jH21Xn5g2TTGJJnHDN1yIvJdjUr3FJCLZsHUWZqfzBWKbEiz\n"
"k+V9vkoDKqRovY0ytTQgFvAChhiTJXtoDwlfK8FZvQWXHOgSGMyPaKCrAiuVJzBe\n"
"6gWdSUkyvO+GuCUlnFlGWFMp4Bw2nLfd+w8KDrPGKLmksIRVn+TvlfUbnymfGabR\n"
"w7M3oJwy/9fo4bNWHZNiN4t8R7eWcvUYAL7W5Awumcm0IfmkG0LSZtPzy93QUJrX\n"
"SgG/++42CqmCY5mMYQ==\n"
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
