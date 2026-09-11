# Firmware ESP32 PhyTera (Compatible Arduino IDE)

Ce projet contient le firmware officiel C++/Arduino pour les boîtiers IoT **PhyTera**, optimisé pour une compatibilité native avec **Arduino IDE** et **PlatformIO**.

---

## 🔬 Capteurs & Écran Pris en Charge

| Équipement | Paramètres Mesurés / Rôle | Interface / Protocole | Tolérance aux Pannes & Affichage |
| :--- | :--- | :--- | :--- |
| **Sensirion SHT45** | Température de l'air (°C) + Humidité de l'air (%) | **I2C** (Adresse `0x44`, SDA: GPIO 21, SCL: GPIO 22) | Haute précision (±0.1°C). Si débranché ➔ `null` backend + `--` sur LCD. |
| **SID12 / SDI-12** | Humidité du sol (%) + Conductivité Électrique Sol (EC en dS/m) | **SDI-12** (Bus 1200 baud, Data: GPIO 14) | Sonde numérique de sol. Si débranchée ➔ `null` backend + `--` sur LCD. |
| **Écran LCD I2C (16x2 / 20x4)** | Affichage physique direct sur le boîtier | **I2C** (Adresse `0x27` ou `0x3F`) | Affiche `T:24C H:65% W:OK` & `S:45% EC:1.8 Q:0` en temps réel sur le terrain. |
| **Moniteur Série** | Console de diagnostic détaillée (115200 baud) | **UART USB** | Horodatage, UUIDs, logs de réseau HTTP et alertes LittleFS. |

---

## ⚡ Caractéristiques Principales

1. **Compatibilité HTTP & HTTPS Automatique (Production Cloud)** :
   - Le firmware détecte automatiquement si l'URL dans `config.h` commence par `http://` (IP locale) ou `https://` (serveur distant déployé sur Render, AWS, Railway, Vercel, etc.).
   - Utilise `WiFiClientSecure` avec `secureClient.setInsecure()` pour que le boîtier communique en HTTPS sans risque de blocage lors des renouvellements automatiques de certificats SSL Let's Encrypt.
2. **Tolérance aux Pannes de Capteurs** :
   - Si le capteur SHT45 ou SID12 est déconnecté ou défaillant, le boîtier transmet `null` et continue d'envoyer le reste des mesures.
3. **Mode Hors-Ligne (*Offline-First*)** :
   - Stockage local LittleFS (`/telemetry_queue.json`) avec vidage automatique par lot (*batching*) au retour du WiFi. si le WiFi est indisponible.
4. **Identifiant Idempotent (`clientUuid`)** :
   - Génération d'un UUID unique par mesure pour éviter les doublons lors des reconnexions.
5. **Authentification Backend NestJS** :
   - Envoi de la clé `x-device-key` dans l'en-tête HTTP POST vers `/api/v1/telemetry/batch`.

---

## 🛠️ Instructions pour Arduino IDE

### 1. Ouvrir dans Arduino IDE
- Ouvrir le fichier [`Phytera_ESP32_Firmware/Phytera_ESP32_Firmware.ino`](file:///d:/Phytera/firmware/Phytera_ESP32_Firmware/Phytera_ESP32_Firmware.ino) dans **Arduino IDE**.

### 2. Cartes & Bibliothèques Requises
Dans le Gestionnaire de Cartes Arduino :
- Sélectionner la carte : **ESP32 Dev Module**

Dans le Gestionnaire de Bibliothèques Arduino (Outils ➔ Gérer les bibliothèques) :
- **ArduinoJson** (par Benoit Blanchon)
- **Adafruit SHT4x Library**

### 3. Configuration
Éditer le fichier [`Phytera_ESP32_Firmware/config.h`](file:///d:/Phytera/firmware/Phytera_ESP32_Firmware/config.h) :
```cpp
#define WIFI_SSID "Votre_WiFi"
#define WIFI_PASSWORD "Votre_Mot_De_Passe"
#define BACKEND_API_URL "http://IP_SERVEUR:3000/api/v1/telemetry/batch"
#define DEVICE_KEY "VOTRE_DEVICE_KEY_OBTENUE_DU_BACKEND"
```

### 4. Téléversement
- Brancher l'ESP32 en USB.
- Sélectionner le Port COM et cliquer sur **Téléverser (Upload)**.
- Ouvrir le **Moniteur Série** réglé à `115200 baud`.
