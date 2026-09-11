#ifndef NETWORK_MANAGER_H
#define NETWORK_MANAGER_H

#include <Arduino.h>

class NetworkManager {
public:
  void begin();
  bool isConnected();
  bool sendBatch(const String& jsonPayload);
};

#endif // NETWORK_MANAGER_H
