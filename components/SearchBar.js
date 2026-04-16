"use client";
import { useState } from "react";
import { destinations } from "@/lib/destinations";

export default function SearchBar({ onSelect, lang }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 1) {
      const filtered = destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(val.toLowerCase()) ||
          d.country.toLowerCase().includes(val.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (dest) => {
    onSelect(dest);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={lang === "en" ? "Search destinations..." : "Destinasyon ara..."}
          value={query}
          onChange={handleSearch}
          className="search-input"
        />
        {query && (
          <button className="clear-btn" onClick={() => { setQuery(""); setResults([]); }}>
            ×
          </button>
        )}
      </div>
      {results.length > 0 && (
        <div className="search-results">
          {results.map((d) => (
            <div key={d.id} className="search-result-item" onClick={() => handleSelect(d)}>
              <span>{d.emoji}</span>
              <span>{d.name}</span>
              <span className="result-country">{d.country}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}