/*
 * ===================================================================================
 * PHYTERA - FIRMWARE ESP32 ARDUINO IDE
 * Capteurs : SHT45 (Air Temp + Hum via I2C) & SID12 (Sol Hum + EC via SDI-12)
 * Tolérance aux Pannes & Mode Hors-Ligne LittleFS
 * ===================================================================================
 */

#include "config.h"
#include "sensor_manager.h"
#include "storage_manager.h"
#include "network_manager.h"
#include "display_manager.h"

static SensorManager sensorMgr;
static StorageManager storageMgr;
static NetworkManager networkMgr;
static DisplayManager displayMgr;

static unsigned long lastTelemetryTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==========================================================");
  Serial.println("  PHYTERA - Firmware ESP32 (Arduino IDE)");
  Serial.println("  Capteurs Spécifiques : SHT45 (Air) & SID12 (Sol EC/Hum)");
  Serial.println("  Affichage LCD I2C, Tolérance Pannes & Synchronisation");
  Serial.println("==========================================================\n");

  sensorMgr.begin();
  storageMgr.begin();
  networkMgr.begin();
  displayMgr.begin();
}

void loop() {
  unsigned long now = millis();

  if (now - lastTelemetryTime >= TELEMETRY_INTERVAL_MS || lastTelemetryTime == 0) {
    lastTelemetryTime = now;

    Serial.println("\n--- [Nouveau Cycle de Mesure SHT45 & SID12] ---");

    // 1. Lecture tolérante des capteurs SHT45 (I2C) & SID12 (SDI-12)
    SensorReading reading = sensorMgr.readAllSensors();

    // 2. Affichage Diagnostic sur Moniteur Série (115200 Baud)
    Serial.println("-> UUID Mesure      : " + String(reading.clientUuid));
    Serial.println("-> SHT45 Temp Air   : " + (reading.isTempAirValid ? String(reading.tempAir) + " °C" : "DÉCONNECTÉ / NULL"));
    Serial.println("-> SHT45 Hum Air    : " + (reading.isHumAirValid ? String(reading.humAir) + " %" : "DÉCONNECTÉ / NULL"));
    Serial.println("-> SID12 Hum Sol    : " + (reading.isHumSolValid ? String(reading.humSol) + " %" : "DÉCONNECTÉ / NULL"));
    Serial.println("-> SID12 EC Sol     : " + (reading.isEcSolValid ? String(reading.ecSol) + " dS/m" : "DÉCONNECTÉ / NULL"));

    // 3. Mise à jour de l'Écran LCD I2C 16x2
    displayMgr.updateDisplay(reading, networkMgr.isConnected(), storageMgr.getQueueSize());

    // 4. Stockage local LittleFS
    storageMgr.saveReadingToQueue(reading);

    // 4. Transmission au backend si le WiFi est disponible
    if (networkMgr.isConnected()) {
      Serial.println("[Loop] Envoi du lot vers l'API Backend...");
      String batchJson = storageMgr.readQueueBatch(20);

      if (batchJson != "[]" && networkMgr.sendBatch(batchJson)) {
        storageMgr.clearQueue();
        digitalWrite(STATUS_LED_PIN, HIGH);
        delay(150);
        digitalWrite(STATUS_LED_PIN, LOW);
      }
    } else {
      Serial.println("[Loop] Mode Hors-Ligne : Données conservées en mémoire flash.");
      networkMgr.begin(); // Tentative de reconnecter le WiFi
    }
  }

  delay(100);
}
