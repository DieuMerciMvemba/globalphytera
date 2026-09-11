#include "storage_manager.h"
#include "config.h"
#include <LittleFS.h>

static const char* QUEUE_FILE = "/telemetry_queue.json";

bool StorageManager::begin() {
  if (!LittleFS.begin(true)) {
    Serial.println("[StorageManager] ERREUR: Échec du montage de la mémoire flash LittleFS");
    return false;
  }
  Serial.println("[StorageManager] LittleFS monté avec succès.");
  return true;
}

bool StorageManager::saveReadingToQueue(const SensorReading& reading) {
  DynamicJsonDocument doc(4096);
  JsonArray array;

  if (LittleFS.exists(QUEUE_FILE)) {
    File readFile = LittleFS.open(QUEUE_FILE, "r");
    if (readFile) {
      deserializeJson(doc, readFile);
      readFile.close();
    }
  }

  if (doc.is<JsonArray>()) {
    array = doc.as<JsonArray>();
  } else {
    array = doc.to<JsonArray>();
  }

  if (array.size() >= MAX_QUEUE_SIZE) {
    Serial.println("[StorageManager] File d'attente pleine. Suppression du plus ancien enregistrement.");
    array.remove(0);
  }

  JsonObject obj = array.createNestedObject();
  obj["clientUuid"] = reading.clientUuid;
  obj["timestamp"] = reading.timestamp;

  // Envoi avec tolérance aux capteurs : si invalide ou débranché -> nullptr (null dans le JSON)
  if (reading.isTempAirValid) obj["tempAir"] = reading.tempAir; else obj["tempAir"] = nullptr;
  if (reading.isHumAirValid) obj["humAir"] = reading.humAir; else obj["humAir"] = nullptr;
  if (reading.isHumSolValid) obj["humSol"] = reading.humSol; else obj["humSol"] = nullptr;
  if (reading.isEcSolValid) obj["ecSol"] = reading.ecSol; else obj["ecSol"] = nullptr;

  File writeFile = LittleFS.open(QUEUE_FILE, "w");
  if (!writeFile) {
    Serial.println("[StorageManager] ERREUR: Impossible d'écrire sur LittleFS");
    return false;
  }

  serializeJson(doc, writeFile);
  writeFile.close();
  Serial.println("[StorageManager] Mesure sauvegardée en mémoire LittleFS (Taille file: " + String(array.size()) + ")");
  return true;
}

size_t StorageManager::getQueueSize() {
  if (!LittleFS.exists(QUEUE_FILE)) return 0;
  File file = LittleFS.open(QUEUE_FILE, "r");
  if (!file) return 0;

  DynamicJsonDocument doc(4096);
  deserializeJson(doc, file);
  file.close();

  if (doc.is<JsonArray>()) {
    return doc.as<JsonArray>().size();
  }
  return 0;
}

String StorageManager::readQueueBatch(size_t maxItems) {
  if (!LittleFS.exists(QUEUE_FILE)) return "[]";
  File file = LittleFS.open(QUEUE_FILE, "r");
  if (!file) return "[]";

  DynamicJsonDocument doc(4096);
  deserializeJson(doc, file);
  file.close();

  if (!doc.is<JsonArray>()) return "[]";

  JsonArray fullArray = doc.as<JsonArray>();
  DynamicJsonDocument batchDoc(4096);
  JsonObject root = batchDoc.to<JsonObject>();
  JsonArray batchArray = root.createNestedArray("measurements");

  size_t count = 0;
  for (JsonObject item : fullArray) {
    if (count >= maxItems) break;
    batchArray.add(item);
    count++;
  }

  String output;
  serializeJson(batchDoc, output);
  return output;
}

void StorageManager::clearQueue() {
  if (LittleFS.exists(QUEUE_FILE)) {
    LittleFS.remove(QUEUE_FILE);
    Serial.println("[StorageManager] File d'attente LittleFS vidée après envoi HTTP réussi.");
  }
}
