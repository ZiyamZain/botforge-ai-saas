import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "USER" | "ASSISTANT";
  content: string;
}

interface Props {
  apiKey: string;
}

const API_BASE = "http://localhost:5001/api";

export default function Widget({ apiKey }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [botColor, setBotColor] = useState("#000000");
  const [botName, setBotName] = useState("Assistant");
  const [greeting, setGreeting] = useState("Hi! How can I help you?");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch bot settings on mount
  useEffect(() => {
    axios
      .get(`${API_BASE}/organization/widget-settings`, {
        headers: { "x-api-key": apiKey },
      })
      .then((res) => {
        setBotColor(res.data.botColor);
        setBotName(res.data.botName);
        setGreeting(res.data.botGreeting);
        setMessages([{ role: "ASSISTANT", content: res.data.botGreeting }]);
      })
      .catch(() => {
        setMessages([{ role: "ASSISTANT", content: greeting }]);
      });
  }, [apiKey]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    
    // Optimistically add user message and an empty assistant message
    setMessages((prev) => [
      ...prev,
      { role: "USER", content: userMsg },
      { role: "ASSISTANT", content: "" }
    ]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({ message: userMsg, sessionId })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let done = false;
      let buffer = "";
      let streamedResponse = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";
          
          for (const part of parts) {
            const line = part.trim();
            if (line.startsWith("data: ")) {
              const dataStr = line.substring(6);
              if (dataStr === "[DONE]") {
                done = true;
                break;
              }
              try {
                const data = JSON.parse(dataStr);
                if (data.sessionId && !sessionId) {
                  setSessionId(data.sessionId);
                }
                if (data.chunk) {
                  // Simulate typing effect by iterating over characters
                  for (let i = 0; i < data.chunk.length; i++) {
                    streamedResponse += data.chunk[i];
                    setMessages((prev) => {
                      const newMessages = [...prev];
                      newMessages[newMessages.length - 1].content = streamedResponse;
                      return newMessages;
                    });
                    // Small delay to fake the typing effect
                    await new Promise((r) => setTimeout(r, 15));
                  }
                }
              } catch (e) {
                console.error("Error parsing chunk", e, dataStr);
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = "Sorry, something went wrong. Please try again.";
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "70px",
            right: "0",
            width: "360px",
            height: "500px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: botColor,
              color: "white",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                🤖
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}>
                  {botName}
                </p>
                <p style={{ fontSize: "11px", opacity: 0.8, margin: 0 }}>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages
              .filter(msg => msg.content.length > 0)
              .map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "USER" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius: "16px",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    background: msg.role === "USER" ? botColor : "#f3f4f6",
                    color: msg.role === "USER" ? "white" : "#111827",
                    borderBottomRightRadius:
                      msg.role === "USER" ? "4px" : "16px",
                    borderBottomLeftRadius:
                      msg.role === "ASSISTANT" ? "4px" : "16px",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 14px",
                    borderRadius: "16px",
                    borderBottomLeftRadius: "4px",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#9ca3af",
                        animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              style={{
                flex: 1,
                border: "1px solid #e5e7eb",
                borderRadius: "24px",
                padding: "8px 16px",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: botColor,
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                fontSize: "16px",
                opacity: loading || !input.trim() ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Bounce animation style */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: botColor,
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
