"use client";

export default function DestinationGrid({ destinations, onSelect, lang }) {
  return (
    <section className="section">
      <h2 className="section-title">
        {lang === "en" ? "Popular Destinations" : "Popüler Destinasyonlar"}
      </h2>
      <div className="dest-grid">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="dest-card"
            onClick={() => onSelect(dest)}
          >
            <div className="dest-emoji">{dest.emoji}</div>
            <div className="dest-name">{dest.name}</div>
            <div className="dest-country">{dest.country}</div>
          </div>
        ))}
      </div>
    </section>
  );
}