from flask import Flask, render_template, request, jsonify, send_from_directory
import requests
import time
from datetime import datetime, timezone

app = Flask(__name__)

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

# In-memory cache: avoids repeated provider requests for the same rounded location.
# Render instances may restart, so this is a lightweight mitigation, not a shared cache.
WEATHER_CACHE = {}
WEATHER_CACHE_SECONDS = 900  # 15 minutes
GEOCODE_CACHE = {}
GEOCODE_CACHE_SECONDS = 86400  # 24 hours


def find_location(query):
    query = (query or "").strip()
    if not query:
        raise ValueError("Enter a town, city, or coordinates.")

    # Accept coordinates such as 17.45, 78.38.
    parts = query.split(",")
    if len(parts) == 2:
        try:
            lat, lon = float(parts[0].strip()), float(parts[1].strip())
            if -90 <= lat <= 90 and -180 <= lon <= 180:
                return {
                    "name": f"{lat:.4f}, {lon:.4f}",
                    "latitude": lat,
                    "longitude": lon,
                }
        except ValueError:
            pass

    cache_key = query.casefold()
    cached_place = GEOCODE_CACHE.get(cache_key)
    if cached_place and time.time() - cached_place["saved_at"] < GEOCODE_CACHE_SECONDS:
        return cached_place["data"]

    response = requests.get(
        GEOCODE_URL,
        params={"name": query, "count": 1, "language": "en", "format": "json"},
        timeout=15,
    )
    response.raise_for_status()
    results = response.json().get("results", [])
    if not results:
        raise ValueError("Location not found. Try a nearby town or city.")
    place = results[0]
    name = ", ".join(
        str(part) for part in (
            place.get("name"), place.get("admin1"), place.get("country")
        ) if part
    )
    result = {
        "name": name,
        "latitude": place["latitude"],
        "longitude": place["longitude"],
    }
    GEOCODE_CACHE[cache_key] = {"saved_at": time.time(), "data": result}
    return result


def get_weather(latitude, longitude):
    cache_key = (round(float(latitude), 3), round(float(longitude), 3))
    cached = WEATHER_CACHE.get(cache_key)
    if cached and time.time() - cached["saved_at"] < WEATHER_CACHE_SECONDS:
        return cached["data"]

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,relative_humidity_2m,precipitation,"
            "weather_code,wind_speed_10m"
        ),
        "hourly": (
            "temperature_2m,precipitation,precipitation_probability,"
            "soil_moisture_0_to_10cm,soil_moisture_10_to_40cm"
        ),
        "daily": (
            "temperature_2m_max,temperature_2m_min,precipitation_sum,"
            "precipitation_probability_max"
        ),
        "forecast_days": 7,
        "timezone": "auto",
    }

    # Do not repeatedly retry HTTP 429; that can worsen rate limiting.
    response = requests.get(WEATHER_URL, params=params, timeout=20)
    if response.status_code == 429:
        retry_after = response.headers.get("Retry-After")
        if retry_after:
            raise ValueError(
                "The weather provider is rate-limiting requests. "
                f"Please wait at least {retry_after} seconds and try again."
            )
        raise ValueError(
            "The weather provider is temporarily rate-limiting requests. "
            "Please try again later."
        )
    response.raise_for_status()
    data = response.json()
    if "current" not in data or "hourly" not in data or "daily" not in data:
        raise ValueError("Weather service returned incomplete data.")

    WEATHER_CACHE[cache_key] = {"saved_at": time.time(), "data": data}
    return data


def nearest_hour_value(weather, key):
    hourly = weather.get("hourly", {})
    times = hourly.get("time", [])
    values = hourly.get(key, [])
    current_time = weather.get("current", {}).get("time", "")
    available = [
        (time_value, value)
        for time_value, value in zip(times, values)
        if value is not None
    ]
    if not available:
        return None
    before = [item for item in available if item[0] <= current_time]
    return before[-1][1] if before else available[0][1]


def analyze_field(form, weather, location):
    soil = form.get("soil", "")
    category = form.get("category", "")
    crop = form.get("crop", "")
    stage = form.get("stage", "")
    current = weather["current"]
    daily = weather["daily"]
    hourly = weather["hourly"]

    # Sum forecast precipitation for the next 24 hours.
    now = current.get("time", "")
    future_rain = 0.0
    for time_value, amount in zip(
        hourly.get("time", []), hourly.get("precipitation", [])
    ):
        if now and time_value >= now:
            future_rain += float(amount or 0)
        if now and time_value > now:
            try:
                if (datetime.fromisoformat(time_value) -
                        datetime.fromisoformat(now)).total_seconds() >= 86400:
                    break
            except ValueError:
                pass

    raw_moisture = nearest_hour_value(weather, "soil_moisture_10_to_40cm")
    raw_moisture_pct = float(raw_moisture) * 100 if raw_moisture is not None else None
    temp = float(current.get("temperature_2m") or 0)
    recent_rain = float(current.get("precipitation") or 0)
    humidity = current.get("relative_humidity_2m")
    wind = current.get("wind_speed_10m")
    max_temp = daily.get("temperature_2m_max", [None])[0]
    min_temp = daily.get("temperature_2m_min", [None])[0]

    # Transparent prototype adjustments: weather provides a regional baseline;
    # soil, crop category, and age range adjust the field estimate and trigger.
    # These are illustrative heuristics, not validated agronomic coefficients.
    soil_adjustment = {
        "Sandy soil": -5.0, "Red soil": -2.0, "Loamy soil": 0.0,
        "Clay soil": 3.0, "Black soil": 3.0,
    }.get(soil, 0.0)
    category_adjustment = {
        "Vegetables": -2.0, "Fruits": -1.0, "Cash crops": -1.0,
        "Grains": 0.0, "Pulses": 1.0,
    }.get(category, 0.0)
    stage_adjustment = {
        "0–1 month": -2.0, "1–2 months": -1.0,
        "2–3 months": -2.0, "3–4 months": 0.0, "4+ months": 2.0,
    }.get(stage, 0.0)
    crop_adjustment = {
        "Rice": -2.0, "Maize": -1.0, "Wheat": 0.0, "Sorghum": 0.0,
        "Millet": 1.0, "Chickpea": 1.0, "Pigeon pea": 0.0,
        "Green gram": 1.0, "Black gram": 1.0, "Tomato": -2.0,
        "Potato": -1.0, "Onion": 0.0, "Chilli": -1.0, "Okra": -1.0,
        "Mango": 0.0, "Banana": -2.0, "Grapes": 0.0, "Citrus": 0.0,
        "Cotton": -1.0, "Sugarcane": -2.0, "Groundnut": 0.0,
        "Soybean": 0.0,
    }.get(crop, 0.0)

    if raw_moisture_pct is not None:
        # Lower estimated moisture for fast-draining soils / higher-demand crops and stages.
        moisture_pct = round(max(3.0, min(60.0,
            raw_moisture_pct + soil_adjustment + category_adjustment + stage_adjustment + crop_adjustment)), 1)
        moisture_source = "weather baseline adjusted for selected field inputs"
    else:
        # Fallback when the weather provider does not return soil moisture.
        # This is explicitly an estimate, not a sensor reading.
        humidity_value = float(humidity or 50)
        estimated = 24.0 + min(future_rain, 15.0) * 0.8 + recent_rain * 1.5
        estimated += (humidity_value - 50) * 0.08 - max(temp - 25, 0) * 0.25
        moisture_pct = round(max(3.0, min(60.0,
            estimated + soil_adjustment + category_adjustment + stage_adjustment + crop_adjustment)), 1)
        moisture_source = "fallback prototype estimate; regional soil-moisture data unavailable"

    # Moisture trigger varies by soil retention, crop group, and growth age.
    soil_trigger = {"Sandy soil": 19.0, "Red soil": 17.0, "Loamy soil": 16.0,
                    "Clay soil": 14.0, "Black soil": 14.0}.get(soil, 16.0)
    crop_trigger = {"Vegetables": 3.0, "Fruits": 2.0, "Cash crops": 1.0,
                    "Grains": 0.0, "Pulses": -1.0}.get(category, 0.0)
    stage_trigger = {"0–1 month": 2.0, "1–2 months": 1.0,
                     "2–3 months": 2.0, "3–4 months": 0.0,
                     "4+ months": -2.0}.get(stage, 0.0)
    crop_trigger_adjustment = {
        "Rice": 2.0, "Maize": 1.0, "Wheat": 0.0, "Sorghum": 0.0,
        "Millet": -1.0, "Chickpea": -1.0, "Pigeon pea": 0.0,
        "Green gram": -1.0, "Black gram": -1.0, "Tomato": 2.0,
        "Potato": 1.0, "Onion": 0.0, "Chilli": 1.0, "Okra": 1.0,
        "Mango": 0.0, "Banana": 2.0, "Grapes": 0.0, "Citrus": 0.0,
        "Cotton": 1.0, "Sugarcane": 2.0, "Groundnut": 0.0,
        "Soybean": 0.0,
    }.get(crop, 0.0)
    irrigation_threshold = soil_trigger + crop_trigger + stage_trigger + crop_trigger_adjustment

    # Rain forecast takes priority. High moisture is a separate red warning;
    # intermediate readings ask the user to inspect the field (yellow).
    if future_rain >= 5:
        decision = "WAIT — RAIN IS FORECAST"
        status = "wait"
        explanation = (f"At least 5 mm of rain is forecast in the next 24 hours. "
                       f"Wait and reassess the field; the selected {soil.lower()} and "
                       f"{category.lower()} inputs are included in the estimate.")
    elif moisture_pct >= 30:
        decision = "DON’T IRRIGATE"
        status = "dont-irrigate"
        explanation = (f"The adjusted moisture estimate is {moisture_pct:.1f}%, above the "
                       "prototype's high-moisture threshold of 30%. Avoid adding water for "
                       "now and verify the root zone in the field.")
    elif moisture_pct < irrigation_threshold:
        decision = "IRRIGATE — VERIFY FIRST"
        status = "irrigate"
        explanation = (f"The adjusted moisture estimate ({moisture_pct:.1f}%) is below the "
                       f"{irrigation_threshold:.1f}% prototype trigger for {soil.lower()}, "
                       f"{category.lower()}, and the {stage} stage, with no substantial "
                       "rain forecast. Check actual root-zone moisture before watering.")
    else:
        decision = "CHECK THE FIELD"
        status = "check"
        explanation = (f"The adjusted moisture estimate ({moisture_pct:.1f}%) is not low "
                       f"enough to trigger irrigation under the selected field settings "
                       f"(trigger: {irrigation_threshold:.1f}%), but it is below the high-" 
                       "moisture range. Inspect the root zone before deciding.")

    reasons = [
        f"Adjusted model-estimated volumetric soil moisture: {moisture_pct:.1f}% at approximately 10–40 cm depth ({moisture_source}).",
        f"Forecast rainfall over the next 24 hours: {future_rain:.1f} mm.",
        f"Current temperature: {temp:.1f} °C; relative humidity: {humidity if humidity is not None else 'unavailable'}%.",
        f"Selected crop: {crop} ({category}); age range: {stage}. Crop/category/stage moisture adjustments: {crop_adjustment + category_adjustment + stage_adjustment:+.1f} percentage points.",
        f"Selected soil type: {soil}; soil adjustment: {soil_adjustment:+.1f} percentage points; irrigation trigger for these crop settings: {irrigation_threshold:.1f}%.",
    ]
    return {
        "location": location["name"], "latitude": location["latitude"],
        "longitude": location["longitude"], "soil": soil, "category": category,
        "crop": crop, "stage": stage, "decision": decision, "status": status,
        "explanation": explanation, "reasons": reasons,
        "moisture_pct": moisture_pct, "moisture_depth": "10–40 cm",
        "temperature": temp, "humidity": humidity, "wind": wind,
        "recent_rain": recent_rain, "future_rain": round(future_rain, 1),
        "today_max": max_temp, "today_min": min_temp,
        "weather_code": current.get("weather_code"), "weather": weather,
        "irrigation_threshold": round(irrigation_threshold, 1),
        "moisture_source": moisture_source,
    }


@app.route("/service-worker.js")
def service_worker():
    """Serve the service worker from the site root so it can control the whole PWA."""
    response = send_from_directory(app.static_folder, "service-worker.js", mimetype="application/javascript")
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Service-Worker-Allowed"] = "/"
    return response


@app.route("/", methods=["GET", "POST"])
def home():
    result = None
    error = None
    form_data = {
        "location": request.form.get("location", "").strip(),
        "soil": request.form.get("soil", ""),
        "category": request.form.get("category", ""),
        "crop": request.form.get("crop", ""),
        "stage": request.form.get("stage", ""),
    }

    if request.method == "POST":
        try:
            if not all(form_data.values()):
                raise ValueError("Please complete your location and all field details.")
            place = find_location(form_data["location"])
            weather = get_weather(place["latitude"], place["longitude"])
            result = analyze_field(form_data, weather, place)
            form_data["location"] = place["name"]
        except (requests.RequestException, ValueError, KeyError) as exc:
            error = (
                "We couldn't complete the analysis. Check your internet connection "
                f"and field location, then try again. Details: {exc}"
            )
        except Exception:
            app.logger.exception("Unexpected analysis error")
            error = "An unexpected error occurred. Check the VS Code terminal for details."

    return render_template(
        "index.html",
        result=result,
        error=error,
        form_data=form_data,
    )


@app.get("/api/weather")
def api_weather():
    location_query = request.args.get("location", "")
    try:
        place = find_location(location_query)
        weather = get_weather(place["latitude"], place["longitude"])
        return jsonify({"location": place, "weather": weather})
    except (requests.RequestException, ValueError, KeyError) as exc:
        message = str(exc)
        status = 429 if "rate-limit" in message.lower() or "rate limiting" in message.lower() else 400
        return jsonify({"error": message}), status


if __name__ == "__main__":
    app.run(debug=True)
