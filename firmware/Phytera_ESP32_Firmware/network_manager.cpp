#include "network_manager.h"
#include "config.h"
#include <WiFi.h>
#include <HTTPClient.h>

void NetworkManager::begin() {
  Serial.print("[NetworkManager] Connexion au réseau WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 15) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[NetworkManager] WiFi Connecté ! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n[NetworkManager] Connexion WiFi en attente (Fonctionnement Hors-Ligne activé).");
  }
}

bool NetworkManager::isConnected() {
  return (WiFi.status() == WL_CONNECTED);
}

#include <WiFiClientSecure.h>

bool NetworkManager::sendBatch(const String& jsonPayload) {
  if (!isConnected()) {
    Serial.println("[NetworkManager] WiFi non connecté.");
    return false;
  }

  HTTPClient http;
  String url = String(BACKEND_API_URL);

  if (url.startsWith("https://")) {
    WiFiClientSecure secureClient;
    // Permet la connexion HTTPS automatique vers n'importe quel domaine/cloud (ex: Render, AWS, Railway, Supabase)
    // sans que le boîtier ne soit bloqué lors des renouvellements de certificats SSL Let's Encrypt.
    secureClient.setInsecure();
    
    http.begin(secureClient, url);
    http.setFollowRedirects(HTTPC_STRICT_FOLLOW);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-device-key", DEVICE_KEY);

    Serial.println("[NetworkManager] Envoi HTTPS sécurisé (Cloud Production) vers: " + url);
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode == 200 || httpResponseCode == 201) {
      String response = http.getString();
      Serial.println("[NetworkManager] Transmission HTTPS Réussie (200 OK): " + response);
      http.end();
      return true;
    } else {
      Serial.println("[NetworkManager] ERREUR HTTPS (Code " + String(httpResponseCode) + ")");
      http.end();
      return false;
    }
  } else {
    WiFiClient client;
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-device-key", DEVICE_KEY);

    Serial.println("[NetworkManager] Envoi HTTP local vers: " + url);
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode == 200 || httpResponseCode == 201) {
      String response = http.getString();
      Serial.println("[NetworkManager] Transmission HTTP Réussie (200 OK): " + response);
      http.end();
      return true;
    } else {
      Serial.println("[NetworkManager] ERREUR HTTP (Code " + String(httpResponseCode) + ")");
      http.end();
      return false;
    }
  }
}
