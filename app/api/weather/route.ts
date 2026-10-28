import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) {
    return NextResponse.json(
      { message: "Please enter a city name." },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { message: "Weather API key is not configured. Add OPENWEATHER_API_KEY to .env.local and restart the server." },
      { status: 500 }
    );
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", city);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) {
      const status = response.status === 404 ? 404 : response.status === 401 ? 401 : 502;
      return NextResponse.json(
        { message: data.message || "Unable to retrieve weather for this city." },
        { status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Could not connect to the weather service. Please try again." },
      { status: 502 }
    );
  }
}
