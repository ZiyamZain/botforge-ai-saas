import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import api from "../lib/axios";
import { Save, Eye, EyeOff, ExternalLink, CheckCircle, XCircle } from "lucide-react";

export default function Settings() {
  const { org, setAuth, token } = useAuthStore();
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  // BYOK state
  const [apiKey, setApiKey] = useState("");
  const [keyLoading, setKeyLoading] = useState(false);

  // Bot customization state
  const [botName, setBotName] = useState(org?.botName || "Assistant");
  const [botColor, setBotColor] = useState(org?.botColor || "#000000");
  const [botGreeting, setBotGreeting] = useState(
    org?.botGreeting || "Hi! How can I help you?",
  );
  const [botInstructions, setBotInstructions] = useState(
    org?.botInstructions || "You are a helpful assistant.",
  );
  const [customLoading, setCustomLoading] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey.startsWith("AIza")) {
      setSaved("error-key");
      return;
    }
    try {
      setKeyLoading(true);
      await api.put("/organization/settings/api-key", { geminiApiKey: apiKey });
      setApiKey("");
      setSaved("key");
      setTimeout(() => setSaved(null), 3000);
      const res = await api.get("/auth/me");
      setAuth(res.data, token!);
    } catch {
      setSaved("error-key");
    } finally {
      setKeyLoading(false);
    }
  };

  const handleSaveCustomization = async () => {
    try {
      setCustomLoading(true);
      await api.put("/organization/settings/customize", {
        botName,
        botColor,
        botGreeting,
        botInstructions,
      });
      setSaved("custom");
      setTimeout(() => setSaved(null), 3000);
      const res = await api.get("/auth/me");
      setAuth(res.data, token!);
    } catch {
      setSaved("error-custom");
    } finally {
      setCustomLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-900">Settings</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Manage API keys and widget appearance</p>
      </div>

      {/* BYOK Section */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-6">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-[14px] font-semibold text-neutral-900">Gemini API Key</h2>
          {org?.hasOwnKey && (
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Active
            </span>
          )}
        </div>
        <p className="text-[12px] text-neutral-400 mb-4">
          Bring your own key for unlimited usage.{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-700 font-medium hover:underline inline-flex items-center gap-0.5"
          >
            Get a free key <ExternalLink className="w-3 h-3" />
          </a>
        </p>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showKey ? "text" : "password"}
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-[13px] pr-9 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all bg-white"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <button
            onClick={handleSaveApiKey}
            disabled={keyLoading || !apiKey}
            className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            {keyLoading ? "Saving…" : "Save"}
          </button>
        </div>
        
        {saved === "key" && (
          <p className="text-[12px] text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> API key saved securely</p>
        )}
        {saved === "error-key" && (
          <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1"><XCircle className="w-3 h-3" /> Invalid key format. Must start with AIza</p>
        )}
      </div>

      {/* Bot Customization Section */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-6">
        <h2 className="text-[14px] font-semibold text-neutral-900 mb-1">Widget Appearance</h2>
        <p className="text-[12px] text-neutral-400 mb-5">Configure how your chatbot looks to visitors</p>

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-neutral-600 mb-1.5 block">Bot Name</label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="Assistant"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-neutral-600 mb-1.5 block">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={botColor}
                onChange={(e) => setBotColor(e.target.value)}
                className="w-9 h-9 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={botColor}
                onChange={(e) => setBotColor(e.target.value)}
                className="border border-neutral-200 rounded-lg px-3 py-2 text-[13px] w-28 font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
              />
              <div
                className="flex-1 rounded-lg px-3 py-2 text-white text-[12px] font-medium text-center"
                style={{ backgroundColor: botColor }}
              >
                Preview
              </div>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-neutral-600 mb-1.5 block">Greeting Message</label>
            <textarea
              value={botGreeting}
              onChange={(e) => setBotGreeting(e.target.value)}
              rows={3}
              placeholder="Hi! How can I help you?"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-neutral-600 mb-1.5 block">System Instructions</label>
            <textarea
              value={botInstructions}
              onChange={(e) => setBotInstructions(e.target.value)}
              rows={4}
              placeholder="You are a helpful assistant..."
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSaveCustomization}
          disabled={customLoading}
          className="mt-5 bg-neutral-900 text-white px-5 py-2 rounded-lg text-[13px] font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          {customLoading ? "Saving…" : "Save Changes"}
        </button>

        {saved === "custom" && (
          <p className="text-[12px] text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Customization saved</p>
        )}
        {saved === "error-custom" && (
          <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed to save changes</p>
        )}
      </div>
    </div>
  );
}
