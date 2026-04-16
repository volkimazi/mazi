"use client";
import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import DestinationGrid from "@/components/DestinationGrid";
import ChatSection from "@/components/ChatSection";
import BookSection from "@/components/BookSection";
import { destinations } from "@/lib/destinations";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("en");
  const [selectedDest, setSelectedDest] = useState(null);
  const [saved, setSaved] = useState([]);
  const [activeTab, setActiveTab] = useState("explore"); // explore | chat | saved

  const toggleSave = (dest) => {
    setSaved((prev) =>
      prev.find((d) => d.id === dest.id)
        ? prev.filter((d) => d.id !== dest.id)
        : [...prev, dest]
    );
  };

  const isSaved = selectedDest && saved.find((d) => d.id === selectedDest.id);

  const handleSelect = (dest) => {
    setSelectedDest(dest);
    setActiveTab("explore");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        lang={lang}
        setLang={setLang}
      />

      <main className="main">
        {/* HERO */}
        <div className="hero">
          <h1>✈️ MAZI TRAVEL</h1>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">150+</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="stat">
              <span className="stat-num">AI</span>
              <span className="stat-label">Powered</span>
            </div>
            <div className="stat">
              <span className="stat-num">Free</span>
              <span className="stat-label">Forever</span>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <SearchBar onSelect={handleSelect} lang={lang} />

        {/* SELECTED DESTINATION */}
        {selectedDest && (
          <div className="selected-dest">
            <div className="selected-dest-info">
              <h3>
                {selectedDest.emoji} {selectedDest.name}
              </h3>
              <p>{selectedDest.description}</p>
            </div>
            <div className="dest-actions">
              <button className="action-btn" onClick={() => toggleSave(selectedDest)}>
                {isSaved ? "♥ Saved" : "🤍 Save"}
              </button>
              <button
                className="action-btn"
                onClick={() =>
                  navigator.share?.({
                    title: `MAZI – ${selectedDest.name}`,
                    url: window.location.href,
                  })
                }
              >
                ↗ Share
              </button>
            </div>
          </div>
        )}

        {/* TABS CONTENT */}
        {activeTab === "explore" && (
          <>
            <BookSection destination={selectedDest} lang={lang} />
            <DestinationGrid
              destinations={destinations}
              onSelect={handleSelect}
              lang={lang}
            />
          </>
        )}

        {activeTab === "chat" && (
          <ChatSection destination={selectedDest} lang={lang} />
        )}

        {activeTab === "saved" && (
          <section className="section">
            <h2 className="section-title">
              {lang === "en" ? "Saved Destinations" : "Kaydedilen Yerler"}
            </h2>
            {saved.length === 0 ? (
              <div className="saved-empty">
                <p>🗺️</p>
                <p>
                  {lang === "en"
                    ? "No saved destinations yet."
                    : "Henüz kayıtlı yer yok."}
                </p>
              </div>
            ) : (
              <div className="saved-list">
                {saved.map((d) => (
                  <div
                    key={d.id}
                    className="saved-item"
                    onClick={() => {
                      handleSelect(d);
                      setActiveTab("explore");
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{d.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700 }}>{d.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.6 }}>{d.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <button
          className={`nav-btn ${activeTab === "explore" ? "active" : ""}`}
          onClick={() => setActiveTab("explore")}
        >
          🌍
          <span className="nav-label">{lang === "en" ? "Explore" : "Keşfet"}</span>
        </button>
        <button
          className={`nav-btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          💬
          <span className="nav-label">{lang === "en" ? "Chat" : "Sohbet"}</span>
        </button>
        <button
          className={`nav-btn ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          🤍
          <span className="nav-label">{lang === "en" ? "Saved" : "Kayıtlı"}</span>
        </button>
      </nav>
    </div>
  );
}