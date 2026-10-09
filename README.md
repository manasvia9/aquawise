# AquaWise — Complete Web App + Installable PWA

## Features
- Flask web application
- Location entry and browser GPS
- Open-Meteo geocoding and weather forecast
- Model-estimated soil moisture at approximately 10–40 cm, displayed as volumetric percentage when available
- Soil type, crop category, crop, and crop-age range inputs
- English, Telugu, and Hindi interface labels and crop options
- Field analysis history stored locally in the browser
- Responsive dashboard and PWA install manifest/service worker

## Run on Windows
1. Install Python 3.10 or newer.
2. Extract the ZIP.
3. Open the extracted `AquaWise_Complete` folder in VS Code.
4. Open Terminal > New Terminal.
5. Run:
   ```powershell
   py -m pip install -r requirements.txt
   py app.py
   ```
6. Open `http://127.0.0.1:5000`.

Internet is required for live geocoding and weather data. A development Flask server is not for production deployment.

## Images
Put these images in `static/images/` using the exact names:
- `farm-hero.svg`
- `red-soil.svg`
- `black-soil.svg`
- `sandy-soil.svg`
- `clay-soil.svg`
- `loamy-soil.svg`
- `grains.svg`
- `pulses.svg`
- `vegetables.svg`
- `fruits.svg`
- `cash-crops.svg`
- `icon-192.png`
- `icon-512.png`

Use clear, accurately labelled photographs that you have permission to use. If an image is missing, the layout still works but its photo will be blank. The app does not download images from Google automatically.

## Install on a phone
- Deploy the app to an HTTPS hosting provider.
- Open the deployed URL in Chrome on Android.
- Use the browser menu and choose **Install app** or **Add to Home screen**.
- The PWA shell can cache some assets, but live weather and analysis still need an internet connection.
- For an APK/native app, use a wrapper such as Capacitor or build a Flutter frontend and connect it to this Flask API.

## Important limitations
- Open-Meteo soil moisture is a gridded model estimate, not a field sensor reading. The displayed percentage is volumetric water content × 100, not percent of plant-available water capacity.
- The prototype adjusts the regional moisture estimate and irrigation trigger based on selected soil, crop category, specific crop, and growth stage. Rainfall of at least 5 mm forecast over the next 24 hours triggers WAIT; high estimated moisture (30% or more) triggers DON’T IRRIGATE; low moisture relative to the selected field trigger can trigger IRRIGATE; intermediate values trigger CHECK THE FIELD. These illustrative rules and adjustments are not agronomically validated.
- Always verify with actual field observations and local agricultural guidance before irrigation.


Visual update: `static/images/farm-background.png` is the photographic farm background used on the welcome and dashboard hero. A fresh visit asks for a field location; the location is prefilled from the last visit but must be submitted again.

## Visual assets

The soil and crop selection cards use bundled, project-generated photographic-style images stored in `static/images/`. The farm background is `static/images/farm-background.png`. These are visual illustrations for the interface, not evidence of actual soil classification or crop condition. The irrigation recommendation remains a prototype estimate.
