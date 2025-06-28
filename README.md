# Benny-Aspirator-Inteligent

Acest proiect este un aspirator inteligent controlabil atât autonom, cât și manual printr-o aplicație mobilă dezvoltată în React Native + Supabase.

Link catre repository githbu -> https://github.com/misu1403/Benny-Aspirator-Inteligent

**Repository-ul conține**:
- Codul sursă pentru ESP32 
- Codul aplicației mobile 
- Configurațiile de build și dependințele


**Componente hardware folosite**
- Placa de dezvoltare ESP32
- 2 Motoare cu reductor
- L298N Motor driver
- 3 Senzori ultrasonici
- 2 Baterii 18650 pentru alimentarea motoarelor si a ventilatorului
- Powerbank pentru ESP32

**Aplicație mobilă**
Aplicația este realizată cu React Native folosind Expo CLI și rulează pe iOS prin Expo GO

Funcționalitățile aplicației:
- Autentificare cu email și parolă
- Control remote
- Vizualizare activitate robot
- Hartă cu traseul robotului

**Cloud Supabase**
- Autentificare
- Salvarea comenzilor
- maparea poziției robotului
- Înregistrari de obstacole și distanțe

**Compilare pentru partea hardware**:
1. Deschide fișierul "Smart Vacuum ESP32.txt" în Arduino IDE
2. Selectează placa ESP32 corespunzătoare
3. Adaugă biblioteca "ArduinoJson" și "WiFi"
4. Compilează și încarcă pe placă.


**Rulare Aplicația Mobilă**
1. Node.js și npm (npm install)
2. Expo CLI (`npm install -g expo-cli`)
3. Expo GO pe iPhone, instalat din App Store
4. După compilarea codului, aplicația poate fi lansată scanând codul QR generat cu camera telefonului. Aceasta va deschide automat aplicația în Expo Go.
