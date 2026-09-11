#include "display_manager.h"
#include "config.h"
#include <Wire.h>

// --- Pilote Écran LCD I2C Résilient ---
class LiquidCrystal_I2C_Simple {
private:
  uint8_t addr;
  uint8_t cols;
  uint8_t rows;
  bool detected;

  void write4Bits(uint8_t value) {
    Wire.beginTransmission(addr);
    Wire.write(value | 0x08); // Backlight ON (Bit 3 = 1)
    Wire.endTransmission();
    
    Wire.beginTransmission(addr);
    Wire.write(value | 0x0C); // Enable High
    Wire.endTransmission();
    delayMicroseconds(1);

    Wire.beginTransmission(addr);
    Wire.write(value | 0x08); // Enable Low
    Wire.endTransmission();
    delayMicroseconds(50);
  }

  void send(uint8_t value, uint8_t mode) {
    uint8_t highnib = value & 0xF0;
    uint8_t lownib = (value << 4) & 0xF0;
    write4Bits(highnib | mode);
    write4Bits(lownib | mode);
  }

public:
  LiquidCrystal_I2C_Simple(uint8_t lcd_addr, uint8_t lcd_cols, uint8_t lcd_rows)
    : addr(lcd_addr), cols(lcd_cols), rows(lcd_rows), detected(false) {}

  bool init() {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      detected = true;
      delay(50);
      write4Bits(0x00);
      delay(1000);
      write4Bits(0x30);
      delayMicroseconds(4500);
      write4Bits(0x30);
      delayMicroseconds(4500);
      write4Bits(0x30);
      delayMicroseconds(150);
      write4Bits(0x20); // Mode 4-bit

      send(0x28, 0); // 2 Lignes, 5x8 Font
      send(0x0C, 0); // Display ON, Cursor OFF
      send(0x01, 0); // Clear Display
      delay(2);
      send(0x06, 0); // Entry Mode
      return true;
    }
    return false;
  }

  void clear() {
    if (detected) send(0x01, 0);
    delay(2);
  }

  void setCursor(uint8_t col, uint8_t row) {
    if (!detected) return;
    int row_offsets[] = { 0x00, 0x40, 0x14, 0x54 };
    send(0x80 | (col + row_offsets[row]), 0);
  }

  void print(const String& str) {
    if (!detected) return;
    for (size_t i = 0; i < str.length(); i++) {
      send(str[i], 0x01); // Mode Donnée RS = 1
    }
  }

  bool isDetected() { return detected; }
};

static LiquidCrystal_I2C_Simple lcd(LCD_I2C_ADDR, LCD_COLS, LCD_ROWS);

void DisplayManager::begin() {
  if (ENABLE_LCD_DISPLAY) {
    if (lcd.init()) {
      Serial.println("[DisplayManager] Écran LCD I2C (0x27) détecté et initialisé.");
      showWelcome();
    } else {
      Serial.println("[DisplayManager] WARNING: Écran LCD I2C non détecté sur l'adresse 0x27.");
    }
  }
}

void DisplayManager::showWelcome() {
  if (!lcd.isDetected()) return;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("  PHYTERA  IoT  ");
  lcd.setCursor(0, 1);
  lcd.print("SHT45 + SID12 EC");
}

void DisplayManager::showMessage(const char* line1, const char* line2) {
  if (!lcd.isDetected()) return;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(String(line1));
  lcd.setCursor(0, 1);
  lcd.print(String(line2));
}

void DisplayManager::updateDisplay(const SensorReading& reading, bool isWifiConnected, size_t queueSize) {
  if (!lcd.isDetected()) return;

  // Ligne 1 : Air (SHT45) -> T:24.5C H:65% W:ON
  String l1 = "T:";
  if (reading.isTempAirValid) {
    l1 += String((int)reading.tempAir) + "C";
  } else {
    l1 += "--";
  }

  l1 += " H:";
  if (reading.isHumAirValid) {
    l1 += String((int)reading.humAir) + "%";
  } else {
    l1 += "--";
  }

  l1 += isWifiConnected ? " W:OK" : " W:NO";

  // Ligne 2 : Sol (SID12) -> S:45% EC:1.8 Q:0
  String l2 = "S:";
  if (reading.isHumSolValid) {
    l2 += String((int)reading.humSol) + "%";
  } else {
    l2 += "--";
  }

  l2 += " EC:";
  if (reading.isEcSolValid) {
    l2 += String(reading.ecSol, 1);
  } else {
    l2 += "--";
  }

  if (queueSize > 0) {
    l2 += " Q:" + String(queueSize);
  }

  // Compléter à 16 caractères pour éviter le clignotement
  while (l1.length() < 16) l1 += " ";
  while (l2.length() < 16) l2 += " ";

  lcd.setCursor(0, 0);
  lcd.print(l1.substring(0, 16));
  lcd.setCursor(0, 1);
  lcd.print(l2.substring(0, 16));
}
