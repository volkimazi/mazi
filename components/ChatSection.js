"use client";
import { useState } from "react";

const topics = [
  { en: "History", tr: "Tarih", icon: "🏛️" },
  { en: "Food", tr: "Yemek", icon: "🍽️" },
  { en: "Hotels", tr: "Oteller", icon: "🏨" },
  { en: "Transport", tr: "Ulaşım", icon: "🚗" },
  { en: "Local Tips", tr: "Yerel İpuçları", icon: "💡" },
  { en: "Hidden Gems", tr: "Gizli Köşeler", icon: "🗺️" },
];

export default function ChatSection({ destination, lang }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);
  const [userInput, setUserInput] = useState("");

  const askTopic = async (topic) => {
    if (!destination) return;

    setActiveTopic(topic.en);
    const userMsg = {
      role: "user",
      content: `Tell me about ${topic.en} in ${destination.name}`,
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destination.name,
          topic: topic.en,
          messages: newMessages,
        }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    }

    setLoading(false);
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !destination) return;

    const userMsg = { role: "user", content: userInput };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destination.name,
          messages: newMessages,
        }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    }

    setLoading(false);
  };

  return (
    <section className="section">
      <h2 className="section-title">🤖 MAZI AI Guide</h2>

      {!destination ? (
        <p className="chat-placeholder">
          {lang === "en"
            ? "Select a destination to start chatting"
            : "Sohbet başlatmak için destinasyon seçin"}
        </p>
      ) : (
        <>
          <div className="topic-buttons">
            {topics.map((t) => (
              <button
                key={t.en}
                className={`topic-btn ${activeTopic === t.en ? "active" : ""}`}
                onClick={() => askTopic(t)}
              >
                {t.icon} {lang === "en" ? t.en : t.tr}
              </button>
            ))}
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <p className="chat-placeholder">
                {lang === "en"
                  ? `Ask me anything about ${destination.name}!`
                  : `${destination.name} hakkında ne sormak istersiniz?`}
              </p>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <span className="msg-icon">{m.role === "user" ? "👤" : "🤖"}</span>
                <div className="msg-text">{m.content}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg assistant">
                <span className="msg-icon">🤖</span>
                <div className="msg-text loading-dots">Thinking...</div>
              </div>
            )}
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              className="chat-input"
              placeholder={lang === "en" ? "Ask anything..." : "Bir şey sorun..."}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-btn" onClick={sendMessage}>
              ↑
            </button>
          </div>
        </>
      )}
    </section>
  );
}