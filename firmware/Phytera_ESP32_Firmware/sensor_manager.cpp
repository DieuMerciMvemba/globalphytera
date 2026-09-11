#include "sensor_manager.h"
#include "config.h"
#include <Wire.h>

// --- Support Protocole SDI-12 pour Capteur SID12 (Sol) ---
// SDI-12 fonctionne à 1200 baud 7E1 sur une ligne bi-directionnelle
class SDI12Bus {
private:
  uint8_t dataPin;
public:
  SDI12Bus(uint8_t pin) : dataPin(pin) {}

  void begin() {
    pinMode(dataPin, INPUT);
  }

  // Envoie une commande SDI-12 (ex: "0M!") et lit la réponse avec timeout
  bool sendCommandAndRead(const char* cmd, char* responseBuf, size_t maxLen) {
    // Séquence Break SDI-12 (> 12ms High)
    pinMode(dataPin, OUTPUT);
    digitalWrite(dataPin, HIGH);
    delayMicroseconds(12500);
    digitalWrite(dataPin, LOW);
    delayMicroseconds(8330); // Marking space

    // Transmettre la commande SDI-12
    for (size_t i = 0; i < strlen(cmd); i++) {
      char c = cmd[i];
      // Transmission 1200 baud bit par bit (833µs par bit, 7-bit parité paire)
      digitalWrite(dataPin, LOW); // Start bit
      delayMicroseconds(833);
      uint8_t parity = 0;
      for (int b = 0; b < 7; b++) {
        int bitVal = (c >> b) & 0x01;
        digitalWrite(dataPin, bitVal ? HIGH : LOW);
        if (bitVal) parity++;
        delayMicroseconds(833);
      }
      digitalWrite(dataPin, (parity % 2 == 0) ? LOW : HIGH); // Parité
      delayMicroseconds(833);
      digitalWrite(dataPin, HIGH); // Stop bit
      delayMicroseconds(833);
    }

    // Basculer en réception
    pinMode(dataPin, INPUT);
    size_t idx = 0;
    unsigned long start = millis();
    while (millis() - start < 1500 && idx < maxLen - 1) {
      // Lecture de la réponse SDI-12 si disponible
      if (digitalRead(dataPin) == LOW) {
        // Début d'octet reçu
        delayMicroseconds(416); // Milieu du start bit
        char c = 0;
        for (int b = 0; b < 7; b++) {
          delayMicroseconds(833);
          if (digitalRead(dataPin)) c |= (1 << b);
        }
        delayMicroseconds(833); // Stop bit
        if (c >= 32 && c <= 126) {
          responseBuf[idx++] = c;
        } else if (c == '\r' || c == '\n') {
          if (idx > 0) break;
        }
      }
    }
    responseBuf[idx] = '\0';
    return (idx > 0);
  }
};

static SDI12Bus sdi12(SDI12_DATA_PIN);

void SensorManager::begin() {
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);
  sdi12.begin();
  pinMode(STATUS_LED_PIN, OUTPUT);
  Serial.println("[SensorManager] Capteurs SHT45 (I2C) & SID12 (SDI-12) initialisés.");
}

void SensorManager::generateUuid(char* uuidBuf) {
  uint32_t r1 = esp_random();
  uint32_t r2 = esp_random();
  uint32_t r3 = esp_random();
  uint32_t r4 = esp_random();

  snprintf(uuidBuf, 37, "%08x-%04x-4%03x-%04x-%08x%04x",
           r1,
           (uint16_t)(r2 >> 16),
           (uint16_t)(r2 & 0x0FFF),
           (uint16_t)((r3 & 0x3FFF) | 0x8000),
           r3,
           (uint16_t)r4);
}

String SensorManager::getIsoTimestamp() {
  unsigned long sec = millis() / 1000;
  char buf[30];
  snprintf(buf, sizeof(buf), "2026-09-11T08:00:%02luZ", sec % 60);
  return String(buf);
}

SensorReading SensorManager::readAllSensors() {
  SensorReading reading;
  generateUuid(reading.clientUuid);
  reading.timestamp = getIsoTimestamp();

  // =========================================================================
  // 1. CAPTEUR SHT45 (Température Air + Humidité Air) via I2C (Adresse 0x44)
  // =========================================================================
  Wire.beginTransmission(SHT4X_I2C_ADDR);
  Wire.write(0xFD); // Commande de mesure haute précision SHT45
  uint8_t err = Wire.endTransmission();

  if (err != 0) {
    Serial.println("[SensorManager] WARNING: SHT45 déconnecté ou non détecté sur l'adresse I2C 0x44. Marqué null.");
    reading.isTempAirValid = false;
    reading.isHumAirValid = false;
    reading.tempAir = 0.0f;
    reading.humAir = 0.0f;
  } else {
    delay(10); // Temps de mesure SHT45
    Wire.requestFrom(SHT4X_I2C_ADDR, 6);
    if (Wire.available() >= 6) {
      uint16_t t_ticks = (Wire.read() << 8) | Wire.read();
      Wire.read(); // CRC Temp (ignoré)
      uint16_t rh_ticks = (Wire.read() << 8) | Wire.read();
      Wire.read(); // CRC Hum (ignoré)

      // Formules officielles Sensirion SHT45
      float tDegC = -45.0f + 175.0f * ((float)t_ticks / 65535.0f);
      float rhPct = -6.0f + 125.0f * ((float)rh_ticks / 65535.0f);
      rhPct = constrain(rhPct, 0.0f, 100.0f);

      reading.isTempAirValid = true;
      reading.tempAir = tDegC;

      reading.isHumAirValid = true;
      reading.humAir = rhPct;
    } else {
      Serial.println("[SensorManager] WARNING: Données SHT45 incomplètes. Marqué null.");
      reading.isTempAirValid = false;
      reading.isHumAirValid = false;
    }
  }

  // =========================================================================
  // 2. CAPTEUR SID12 / SDI-12 (Humidité Sol + Conductivité EC Sol)
  // =========================================================================
  char resp[64];
  // Commande SDI-12 d'inquisition "0M!" (adresse '0', Measure)
  bool sdiSuccess = sdi12.sendCommandAndRead("0M!", resp, sizeof(resp));

  if (!sdiSuccess) {
    // Fallback simulation / Tolérance aux pannes si le capteur SID12 est débranché
    Serial.println("[SensorManager] WARNING: Capteur SID12 (SDI-12) non détecté sur GPIO " + String(SDI12_DATA_PIN) + ". Marqué null.");
    reading.isHumSolValid = false;
    reading.isEcSolValid = false;
    reading.humSol = 0.0f;
    reading.ecSol = 0.0f;
  } else {
    // Lecture des valeurs enregistrées par SID12 via commande "0D0!"
    delay(500);
    char dataResp[64];
    if (sdi12.sendCommandAndRead("0D0!", dataResp, sizeof(dataResp))) {
      // Format typique SDI-12: "0+45.2+1.85" -> 45.2% Humidité Sol, 1.85 dS/m EC
      float humVal = 0.0f, ecVal = 0.0f;
      int count = sscanf(dataResp, "%*c+%f+%f", &humVal, &ecVal);
      if (count >= 2 && humVal >= 0.0f && humVal <= 100.0f && ecVal >= 0.0f && ecVal <= 30.0f) {
        reading.isHumSolValid = true;
        reading.humSol = humVal;

        reading.isEcSolValid = true;
        reading.ecSol = ecVal;
      } else {
        Serial.println("[SensorManager] WARNING: Format de réponse SID12 invalide. Marqué null.");
        reading.isHumSolValid = false;
        reading.isEcSolValid = false;
      }
    } else {
      reading.isHumSolValid = false;
      reading.isEcSolValid = false;
    }
  }

  return reading;
}
