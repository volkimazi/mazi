"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Send, MapPin, UtensilsCrossed, Compass,
  Share2, Copy, Navigation, Bookmark,
  Globe, MessageCircle, Heart,
} from "lucide-react";

const DESTINATIONS = [
  { id: "istanbul", name: "İstanbul", country: "Türkiye", emoji: "🕌", desc: "İki kıtanın buluştuğu şehir", agoda: "https://www.agoda.com/city/istanbul-tr.html", weather: "İstanbul hava durumu", mapQ: "Istanbul Turkey", bg: "dest-bg-istanbul" },
  { id: "paris", name: "Paris", country: "Fransa", emoji: "🗼", desc: "Işıklar şehri", agoda: "https://www.agoda.com/city/paris-fr.html", weather: "Paris weather", mapQ: "Paris France", bg: "dest-bg-paris" },
  { id: "dubai", name: "Dubai", country: "BAE", emoji: "🏙️", desc: "Çöldeki lüks", agoda: "https://www.agoda.com/city/dubai-ae.html", weather: "Dubai weather", mapQ: "Dubai UAE", bg: "dest-bg-dubai" },
  { id: "tokyo", name: "Tokyo", country: "Japonya", emoji: "⛩️", desc: "Gelenekle modernin buluşması", agoda: "https://www.agoda.com/city/tokyo-jp.html", weather: "Tokyo weather", mapQ: "Tokyo Japan", bg: "dest-bg-tokyo" },
  { id: "bali", name: "Bali", country: "Endonezya", emoji: "🌴", desc: "Tanrıların adası", agoda: "https://www.agoda.com/city/bali-id.html", weather: "Bali weather", mapQ: "Bali Indonesia", bg: "dest-bg-bali" },
  { id: "rome", name: "Roma", country: "İtalya", emoji: "🏛️", desc: "Ebedi şehir", agoda: "https://www.agoda.com/city/rome-it.html", weather: "Rome weather", mapQ: "Rome Italy", bg: "dest-bg-rome" },
  { id: "barcelona", name: "Barselona", country: "İspanya", emoji: "🎨", desc: "Gaudí ve plajlar", agoda: "https://www.agoda.com/city/barcelona-es.html", weather: "Barcelona weather", mapQ: "Barcelona Spain", bg: "dest-bg-barcelona" },
  { id: "newyork", name: "New York", country: "ABD", emoji: "🗽", desc: "Asla uyumayan şehir", agoda: "https://www.agoda.com/city/new-york-us.html", weather: "New York weather", mapQ: "New York USA", bg: "dest-bg-newyork" },
];

function parsePlan(text) {
  if (!text) return [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const days = [];
  let currentDay = null;
  for (const line of lines) {
    const clean = line.replace(/\*\*/g, "").replace(/^#+\s*/, "").trim();
    if (/(\d+\.\s*g[uü]n)|(g[uü]n\s*\d+)|(day\s*\d+)/i.test(clean)) {
      if (currentDay) days.push(currentDay);
      currentDay = { title: clean, activity: "", place: "", food: "", extra: [] };
      continue;
    }
    if (!currentDay) continue;
    if (/Aktivite|Activity/i.test(clean)) {
      currentDay.activity = clean.replace(/^-?\s*(Aktivite|Activity)\s*:?\s*/i, "");
    } else if (/Yer|Place|Location|Gezilecek/i.test(clean)) {
      currentDay.place = clean.replace(/^-?\s*(Yer|Place|Location|Gezilecek)\s*:?\s*/i, "");
    } else if (/Yemek|Food/i.test(clean)) {
      currentDay.food = clean.replace(/^-?\s*(Yemek|Food)\s*:?\s*/i, "");
    } else if (!/^[—-]+$/.test(clean)) {
      currentDay.extra.push(clean.replace(/^-+\s*/, ""));
    }
  }
  if (currentDay) days.push(currentDay);
  return days;
}

export default function Home() {
  const [tab, setTab] = useState("ai");
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDest, setSelectedDest] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [currentPlanTitle, setCurrentPlanTitle] = useState("");

  const parsedDays = useMemo(() => parsePlan(reply), [reply]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mazi_saved_plans");
      if (stored) setSavedPlans(JSON.parse(stored));
    } catch {}
  }, []);

  const savePlanToStorage = (plans) => {
    setSavedPlans(plans);
    localStorage.setItem("mazi_saved_plans", JSON.stringify(plans));
  };

  const handleAsk = async (customInput) => {
    const query = customInput || input;
    if (!query.trim()) return;
    setCurrentPlanTitle(query);
    setTab("ai");
    setLoading(true);
    setReply("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: query }] }),
      });
      const data = await res.json();
      setReply(res.ok ? data.message : `Hata: ${data.error}`);
    } catch {
      setReply("Bağlantı hatası.");
    }
    setLoading(false);
  };

  const handleSavePlan = () => {
    if (!reply || !currentPlanTitle) return;
    const newPlan = { id: Date.now(), title: currentPlanTitle, content: reply, date: new Date().toLocaleDateString("tr-TR") };
    const updated = [newPlan, ...savedPlans.slice(0, 9)];
    savePlanToStorage(updated);
    alert("Plan kaydedildi ✅");
  };

  const handleDeletePlan = (id) => savePlanToStorage(savedPlans.filter((p) => p.id !== id));

  const handleLoadPlan = (plan) => {
    setReply(plan.content);
    setCurrentPlanTitle(plan.title);
    setTab("ai");
  };

  const handleCopy = async () => {
    if (!reply) return;
    await navigator.clipboard.writeText(reply).catch(() => {});
    alert("Kopyalandı ✅");
  };

  const handleShare = async () => {
    if (!reply) return;
    if (navigator.share) {
      await navigator.share({ title: "MAZI Seyahat Planı", text: reply }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(reply).catch(() => {});
      alert("Kopyalandı!");
    }
  };

  const openMap = (place) => {
    if (!place) return;
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(place)}`, "_blank");
  };

  const selectDest = (dest) => {
    setSelectedDest(dest);
    setTab("explore");
  };

  return (
    <main className="home">
      {/* ─── LOGO ─── */}
      <div className="logo">✈️ MAZI <span>TRAVEL</span></div>

      <div className="tab-content">

        {/* ══════ AI TAB ══════ */}
        {tab === "ai" && (
          <>
            <h1 className="hero-title">Nereye gitmek<br />istiyorsun?</h1>
            <p className="hero-sub">Yapay zekayla planla, keşfet ve yola çık.</p>

            <div className="ai-box">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Örn: 5 günlük İstanbul turu yaz"
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              />
              <button onClick={() => handleAsk()}>
                <Send size={18} />
              </button>
            </div>

            <div className="quick">
              {[
                { label: "Paris gezisi", q: "Paris için 3 günlük gezi planı yap" },
                { label: "Dubai lüks tatil", q: "Dubai lüks tatil planı yap" },
                { label: "Tokyo keşif", q: "Tokyo için keşif planı yap" },
              ].map((item) => (
                <div key={item.label} onClick={() => { setInput(item.q); handleAsk(item.q); }}>
                  {item.label}
                </div>
              ))}
            </div>

            {(loading || reply) && (
              <div className="reply-card">
                <div className="reply-top">
                  <div className="reply-badge">MAZI AI</div>
                  <div className="reply-status">{loading ? "Düşünüyor..." : "Plan hazır ✅"}</div>
                </div>
                <div className="reply-title">
                  {loading ? "Rotanız hazırlanıyor..." : "Kişiselleştirilmiş planınız"}
                </div>
                {!loading && reply && (
                  <div className="reply-actions">
                    <button className="reply-action-btn" onClick={handleShare}>
                      <Share2 size={15} /><span>Paylaş</span>
                    </button>
                    <button className="reply-action-btn" onClick={handleCopy}>
                      <Copy size={15} /><span>Kopyala</span>
                    </button>
                    <button className="reply-action-btn save-btn" onClick={handleSavePlan}>
                      <Bookmark size={15} /><span>Kaydet</span>
                    </button>
                  </div>
                )}
                {loading ? (
                  <div className="reply-content loading-dots">Plan hazırlanıyor...</div>
                ) : parsedDays.length > 0 ? (
                  <div className="day-cards">
                    {parsedDays.map((day, index) => (
                      <div className="day-card" key={index}>
                        <div className="day-card-head">
                          <div className="day-pill">Gün {index + 1}</div>
                          <div className="day-title">{day.title}</div>
                        </div>
                        {day.activity && (
                          <div className="day-row">
                            <div className="day-row-icon"><Compass size={16} /></div>
                            <div>
                              <div className="day-row-label">Aktivite</div>
                              <div className="day-row-text">{day.activity}</div>
                            </div>
                          </div>
                        )}
                        {day.place && (
                          <div className="day-row">
                            <div className="day-row-icon"><MapPin size={16} /></div>
                            <div>
                              <div className="day-row-label">Yer</div>
                              <div className="day-row-text">{day.place}</div>
                            </div>
                          </div>
                        )}
                        {day.food && (
                          <div className="day-row">
                            <div className="day-row-icon"><UtensilsCrossed size={16} /></div>
                            <div>
                              <div className="day-row-label">Yemek</div>
                              <div className="day-row-text">{day.food}</div>
                            </div>
                          </div>
                        )}
                        {day.extra.length > 0 && (
                          <div className="day-extra">
                            {day.extra.map((item, idx) => (
                              <div className="day-extra-item" key={idx}>{item}</div>
                            ))}
                          </div>
                        )}
                        <div className="day-card-actions">
                          <button className="day-card-btn" onClick={() => openMap(day.place || day.title)}>
                            <Navigation size={14} /><span>Haritada Gör</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="reply-content">{reply}</div>
                )}
              </div>
            )}
          </>
        )}

        {/* ══════ EXPLORE TAB ══════ */}
        {tab === "explore" && (
          <>
            <h1 className="hero-title">Destinasyonları<br />Keşfet</h1>
            <p className="hero-sub">Bir yer seçin, planlamaya başlayın.</p>

            {selectedDest && (
              <div className="dest-selected-card">
                <div className="dest-selected-top">
                  <span className="dest-selected-emoji">{selectedDest.emoji}</span>
                  <div>
                    <div className="dest-selected-name">{selectedDest.name}</div>
                    <div className="dest-selected-country">{selectedDest.country}</div>
                  </div>
                </div>
                <p className="dest-selected-desc">{selectedDest.desc}</p>
                <div className="book-grid">
                  <a href={selectedDest.agoda} target="_blank" rel="noopener" className="book-btn">
                    <span className="book-btn-emoji">🏨</span><span>Otel</span>
                  </a>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(selectedDest.weather)}`} target="_blank" rel="noopener" className="book-btn">
                    <span className="book-btn-emoji">⛅</span><span>Hava</span>
                  </a>
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(selectedDest.mapQ)}`} target="_blank" rel="noopener" className="book-btn">
                    <span className="book-btn-emoji">🗺️</span><span>Harita</span>
                  </a>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(selectedDest.name + " araç kiralama")}`} target="_blank" rel="noopener" className="book-btn">
                    <span className="book-btn-emoji">🚗</span><span>Araç</span>
                  </a>
                </div>
                <button className="plan-btn" onClick={() => { const q = `${selectedDest.name} için 3 günlük seyahat planı yaz`; setInput(q); handleAsk(q); }}>
                  🤖 AI ile Plan Yap →
                </button>
              </div>
            )}

            <p className="section-title">Popüler Destinasyonlar</p>
            <div className="dest-grid">
              {DESTINATIONS.map((d) => (
                <div key={d.id} className={`dest-card ${selectedDest?.id === d.id ? "active" : ""}`} onClick={() => selectDest(d)}>
                  <div className={`dest-card-bg ${d.bg}`} />
                  <div className="dest-card-overlay" />
                  <div className="dest-card-info">
                    <div className="dest-name">{d.emoji} {d.name}</div>
                    <div className="dest-country">{d.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══════ SAVED TAB ══════ */}
        {tab === "saved" && (
          <>
            <h1 className="hero-title">Kaydedilen<br />Planlar</h1>
            <p className="hero-sub">{savedPlans.length === 0 ? "Henüz plan kaydedilmedi." : `${savedPlans.length} plan kaydedildi.`}</p>

            {savedPlans.length === 0 ? (
              <div className="saved-empty">
                <div style={{ fontSize: 52 }}>🗺️</div>
                <p>AI ile plan yap ve kaydet!</p>
                <button
  className="plan-btn"
  style={{ color: '#000', marginTop: 8 }}
  onClick={() => setTab("ai")}
>
  AI'a Sor →
</button>
              </div>
            ) : (
              <div className="saved-list">
                {savedPlans.map((plan) => (
                  <div key={plan.id} className="saved-item">
                    <div className="saved-item-info">
                      <div className="saved-item-title">{plan.title}</div>
                      <div className="saved-item-date">{plan.date}</div>
                    </div>
                    <div className="saved-item-actions">
                      <button className="saved-load-btn" onClick={() => handleLoadPlan(plan)}>Aç</button>
                      <button className="saved-delete-btn" onClick={() => handleDeletePlan(plan.id)}>Sil</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ══════ BOTTOM NAV ══════ */}
      <div className="bottom-nav">
        <button className={`nav-item ${tab === "explore" ? "active" : ""}`} onClick={() => setTab("explore")}>
          <Globe size={22} /><span>Keşfet</span>
        </button>
        <button className={`nav-item ${tab === "ai" ? "active" : ""}`} onClick={() => setTab("ai")}>
          <MessageCircle size={22} /><span>AI Plan</span>
        </button>
        <button className={`nav-item ${tab === "saved" ? "active" : ""}`} onClick={() => setTab("saved")}>
          <Heart size={22} /><span>Kayıtlı</span>
        </button>
      </div>
    </main>
  );
}