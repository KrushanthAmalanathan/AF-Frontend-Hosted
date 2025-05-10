import { useState, useEffect } from "react";

export default function useWeatherCoords(lat, lon) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lat == null || lon == null) return;

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    console.log("🔑 OPENWEATHER KEY:", apiKey);
    const url = `https://api.openweathermap.org/data/2.5/weather`
      + `?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    console.log("🌐 Fetching weather:", url);

    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          console.error("⚠️ Weather fetch error:", res.status, res.statusText);
          throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        setError(null);
      })
      .catch((err) => {
        console.error("🔥 useWeatherCoords caught:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [lat, lon]);

  return { weather, loading, error };
}
