#ifndef DISPLAY_MANAGER_H
#define DISPLAY_MANAGER_H

#include <Arduino.h>
#include "sensor_manager.h"

class DisplayManager {
public:
  void begin();
  void showWelcome();
  void updateDisplay(const SensorReading& reading, bool isWifiConnected, size_t queueSize);
  void showMessage(const char* line1, const char* line2);
};

#endif // DISPLAY_MANAGER_H
