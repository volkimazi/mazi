"use client";

import { Building2, Map, CloudSun, Car } from "lucide-react";

export default function BookSection({ destination, lang }) {
  if (!destination) return null;

  const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(destination.mapQuery)}`;
  const weatherUrl = `https://www.google.com/search?q=${encodeURIComponent(destination.weatherQuery)}`;
  const carRentalUrl = `https://www.google.com/search?q=${encodeURIComponent(destination.name + " car rental")}`;

  return (
    <section className="section">
      <h2 className="section-title">
        {lang === "en" ? "Book & Explore" : "Rezervasyon & Kesfet"}
      </h2>

      <div className="book-grid">
        <a
          href={destination.hotelLink}
          target="_blank"
          rel="noopener noreferrer"
          className="book-card"
        >
          <Building2 size={22} strokeWidth={2.1} className="book-svg-icon" />
          <span>{lang === "en" ? "Hotels" : "Oteller"}</span>
        </a>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="book-card"
        >
          <Map size={22} strokeWidth={2.1} className="book-svg-icon" />
          <span>{lang === "en" ? "Map" : "Harita"}</span>
        </a>

        <a
          href={weatherUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="book-card"
        >
          <CloudSun size={22} strokeWidth={2.1} className="book-svg-icon" />
          <span>{lang === "en" ? "Weather" : "Hava"}</span>
        </a>

        <a
          href={carRentalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="book-card"
        >
          <Car size={22} strokeWidth={2.1} className="book-svg-icon" />
          <span>{lang === "en" ? "Car Rental" : "Arac Kiralama"}</span>
        </a>
      </div>
    </section>
  );
}