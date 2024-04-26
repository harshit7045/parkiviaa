#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

#define SERVO_PIN D0

Servo servo;

const char* ssid = "33";
const char* password = "harshit7045";
const char* serverAddress = "192.168.47.46";  // Replace with your server's IP address
const int serverPort = 8000;

#define SS_PIN D4
#define RST_PIN D3
#define LED_PIN D1

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance
WiFiClient client;

void setup() {
  Serial.begin(9600);
  servo.attach(SERVO_PIN);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  servo.write(0);
    Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  SPI.begin();
  mfrc522.PCD_Init();
  pinMode(LED_PIN, OUTPUT);
}

void sendToServer(String message, int pincode) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, "http://" + String(serverAddress) + ":" + String(serverPort) + "/iot");
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<128> jsonDocument;
    jsonDocument["message"] = message;
    jsonDocument["pincode"] = pincode;

    String jsonString;
    serializeJson(jsonDocument, jsonString);

    int httpResponseCode = http.PUT(jsonString);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
}

void loop() {
  // RFID card reading
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String readUID = String(mfrc522.uid.uidByte[0], HEX) + String(mfrc522.uid.uidByte[1], HEX) + String(mfrc522.uid.uidByte[2], HEX) + String(mfrc522.uid.uidByte[3], HEX);
    readUID.toUpperCase();
    Serial.println(readUID);
    if (1) {
      digitalWrite(LED_PIN, HIGH);



      sendToServer(readUID, 228001);
      // Sending data to server
      servo.write(180);
      delay(1000);  // Wait for 1 second
      digitalWrite(LED_PIN, LOW);
      // Rotate the servo back to 0 degrees
      servo.write(0);
      delay(1000);
    }

    mfrc522.PICC_HaltA();
  }
}
