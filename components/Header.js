"use client";

export default function Header({ darkMode, setDarkMode, lang, setLang }) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">🌍 MAZI</span>
        <span className="logo-sub">TRAVEL</span>
      </div>
      <div className="header-right">
        <button
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button
          className="lang-btn"
          onClick={() => setLang(lang === "en" ? "tr" : "en")}
        >
          {lang === "en" ? "TR" : "EN"}
        </button>
      </div>
    </header>
  );
}