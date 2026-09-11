# PhyTera — Plateforme Globale de Surveillance Végétale Automatisée & Agricole

**PhyTera** est une solution complète, intelligente et mobile d'agriculture de précision comprenant :

1. **Backend Central NestJS** (`/backend_phytera`) :
   - API REST, PostgreSQL avec Prisma, WebSockets en temps réel et moteur de règles pour la détection des maladies (Mildiou, Oïdium, Stress Hydrique).
   - Ingestion des télémétries avec tolérance aux pannes de capteurs et idempotence hors-ligne.
   - Module de pré-configuration technicien et validation d'installation par l'agriculteur.

2. **Application Client / Agriculteur** (`/frontend_client`) :
   - Interface web/mobile React + TailwindCSS pour la gestion des parcelles, suivi des capteurs, cartographie et validation des propositions d'installations IoT.

3. **Application Technicien** (`/frontend_techn`) :
   - Interface web pour le suivi de la maintenance des boîtiers, la gestion des tickets d'interventions et la proposition de parcelles avec numéros de série ESP32 générés automatiquement.

4. **Application Administration** (`/frontend_admin`) :
   - Tableau de bord de supervision globale, gestion des utilisateurs, abonnements et logs d'audit.

5. **Firmware Boîtier ESP32** (`/firmware/Phytera_ESP32_Firmware`) :
   - Sketch Arduino IDE nativement compatible avec capteurs **Sensirion SHT45** (Air I2C) et **SID12 / SDI-12** (Sol EC & Humidité).
   - Affichage LCD I2C 16x2, mémoire flash LittleFS pour le mode hors-ligne et support HTTPS automatique.
