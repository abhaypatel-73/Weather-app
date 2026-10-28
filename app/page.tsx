"use client";

import { FormEvent, useState } from "react";

type WeatherData = {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number };
};

export default function Home() {
  const [city, setCity] = useState("Lucknow");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function getWeather(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Weather request failed.");
      }

      setWeather(data as WeatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-950 via-blue-800 to-cyan-600 px-4 py-12 text-white sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Live weather updates</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Weather<span className="text-cyan-300">Now</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-blue-100 sm:text-lg">
            Check the current weather, temperature, humidity and wind for any city.
          </p>
        </header>

        <form onSubmit={getWeather} className="mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-lg sm:flex-row">
          <label className="sr-only" htmlFor="city">City name</label>
          <input
            id="city"
            className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-cyan-300 placeholder:text-slate-500 focus:ring-2"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Enter a city, e.g. Delhi"
            autoComplete="address-level2"
          />
          <button
            className="rounded-xl bg-cyan-300 px-6 py-3 font-bold text-sky-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Checking..." : "Get weather"}
          </button>
        </form>

        <div aria-live="polite">
          {error && (
            <div role="alert" className="mx-auto mt-5 max-w-xl rounded-xl border border-red-200/40 bg-red-950/40 px-4 py-3 text-center text-red-100">
              {error}
            </div>
          )}

          {weather && (
            <section className="mx-auto mt-8 max-w-xl rounded-3xl border border-white/30 bg-white/15 p-6 shadow-2xl backdrop-blur-xl sm:p-8" aria-label="Current weather">
              <div className="flex flex-col items-center justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-medium text-cyan-100">Current weather in</p>
                  <h2 className="mt-1 text-3xl font-bold sm:text-4xl">{weather.name}, {weather.sys.country}</h2>
                  <p className="mt-2 capitalize text-blue-100">{weather.weather[0]?.description}</p>
                </div>
                {weather.weather[0]?.icon && (
                  // OpenWeather supplies this icon for the current conditions.
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    width={100}
                    height={100}
                  />
                )}
              </div>

              <div className="my-6 flex items-center justify-center gap-3 border-y border-white/20 py-6 sm:justify-start">
                <p className="text-7xl font-extrabold tracking-tighter">{Math.round(weather.main.temp)}°</p>
                <div className="text-sm text-blue-100">
                  <p className="text-lg font-semibold text-white">Celsius</p>
                  <p>Feels like {Math.round(weather.main.feels_like)}°C</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Humidity</p>
                  <p className="mt-1 text-2xl font-bold">{weather.main.humidity}%</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Wind speed</p>
                  <p className="mt-1 text-2xl font-bold">{weather.wind.speed} m/s</p>
                </div>
                <div className="col-span-2 rounded-2xl bg-white/10 p-4 sm:col-span-1">
                  <p className="text-sm text-blue-100">Pressure</p>
                  <p className="mt-1 text-2xl font-bold">{weather.main.pressure} hPa</p>
                </div>
              </div>
            </section>
          )}
        </div>

        <footer className="mt-10 text-center text-sm text-blue-100">
          Weather data provided by OpenWeather.
        </footer>
      </div>
    </main>
  );
}
