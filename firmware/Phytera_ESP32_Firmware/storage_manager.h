#ifndef STORAGE_MANAGER_H
#define STORAGE_MANAGER_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include "sensor_manager.h"

class StorageManager {
public:
  bool begin();
  bool saveReadingToQueue(const SensorReading& reading);
  size_t getQueueSize();
  String readQueueBatch(size_t maxItems);
  void clearQueue();
};

#endif // STORAGE_MANAGER_H
