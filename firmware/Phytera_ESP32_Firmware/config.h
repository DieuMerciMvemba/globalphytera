#ifndef CONFIG_H
#define CONFIG_H

// --- Configuration Réseau & Backend ---
#define WIFI_SSID "PhyTera_Farm_WiFi"
#define WIFI_PASSWORD "PhyTera2026Safe"

// URL de l'API Backend NestJS
#define BACKEND_API_URL "http://192.168.1.50:3000/api/v1/telemetry/batch"

// Clé unique d'authentification du boîtier (Générée par le backend NestJS)
#define DEVICE_KEY "PHYTERA_A1B2C3D4E5F6789012345678"

// --- Configuration des Capteurs SHT45 & SID12 (SDI-12) ---

// 1. Capteur SHT45 (Température Air + Humidité Air) -> Interface I2C
#define I2C_SDA_PIN 21
#define I2C_SCL_PIN 22
#define SHT4X_I2C_ADDR 0x44

// 2. Capteur SID12 / SDI-12 (Humidité Sol + EC Sol) -> Interface SDI-12
#define SDI12_DATA_PIN 14 // Broche de données bi-directionnelle SDI-12
#define SDI12_ADDRESS '0' // Adresse SDI-12 par défaut

// 3. LED Témoin Statut & Intervalles
#define STATUS_LED_PIN 2
#define TELEMETRY_INTERVAL_MS 15000 // Mesure toutes les 15 secondes
#define MAX_QUEUE_SIZE 200          // Capacité mémoire LittleFS offline

// 4. Écran LCD I2C (16x2 ou 20x4)
#define ENABLE_LCD_DISPLAY true
#define LCD_I2C_ADDR 0x27           // Adresse I2C habituelle des écrans LCD (0x27 ou 0x3F)
#define LCD_COLS 16
#define LCD_ROWS 2

#endif // CONFIG_H
