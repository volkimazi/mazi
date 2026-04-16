"use client";

import {
  Landmark,
  Torus,
  Building2,
  Church,
  Palmtree,
  Paintbrush2,
  Plane,
} from "lucide-react";

function getDestinationIcon(id) {
  switch (id) {
    case "paris":
      return <Plane size={28} strokeWidth={2.1} />;
    case "tokyo":
      return <Torus size={28} strokeWidth={2.1} />;
    case "dubai":
      return <Building2 size={28} strokeWidth={2.1} />;
    case "istanbul":
      return <Church size={28} strokeWidth={2.1} />;
    case "newyork":
      return <Landmark size={28} strokeWidth={2.1} />;
    case "rome":
      return <Landmark size={28} strokeWidth={2.1} />;
    case "bali":
      return <Palmtree size={28} strokeWidth={2.1} />;
    case "barcelona":
      return <Paintbrush2 size={28} strokeWidth={2.1} />;
    default:
      return <Plane size={28} strokeWidth={2.1} />;
  }
}

export default function DestinationGrid({ destinations, onSelect, lang }) {
  return (
    <section className="section">
      <h2 className="section-title">
        {lang === "en" ? "Popular Destinations" : "Populer Destinasyonlar"}
      </h2>

      <div className="dest-grid">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="dest-card"
            onClick={() => onSelect(dest)}
          >
            <div className="dest-emoji destination-svg-icon">
              {getDestinationIcon(dest.id)}
            </div>
            <div className="dest-name">{dest.name}</div>
            <div className="dest-country">{dest.country}</div>
          </div>
        ))}
      </div>
    </section>
  );
}