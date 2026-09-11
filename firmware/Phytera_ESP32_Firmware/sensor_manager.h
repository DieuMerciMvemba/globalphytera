#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <Arduino.h>

struct SensorReading {
  char clientUuid[37]; // UUID unique v4 pour l'idempotence backend
  String timestamp;    // Horodatage ISO 8601

  // SHT45 (Air)
  float tempAir;
  bool isTempAirValid;

  float humAir;
  bool isHumAirValid;

  // SID12 / SDI-12 (Sol)
  float humSol;        // Humidité du Sol / VWC (%)
  bool isHumSolValid;

  float ecSol;         // Conductivité Électrique Sol / Bulk EC (dS/m)
  bool isEcSolValid;
};

class SensorManager {
public:
  void begin();
  SensorReading readAllSensors();
  void generateUuid(char* uuidBuf);
  String getIsoTimestamp();
};

#endif // SENSOR_MANAGER_H
