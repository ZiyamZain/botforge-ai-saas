import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Copy, Check, Terminal } from "lucide-react";

export default function Embed() {
  const org = useAuthStore((s) => s.org);
  const [copied, setCopied] = useState(false);

  const snippet = `<script\n  src="https://yourdomain.com/widget.js"\n  data-api-key="${org?.apiKey}">\n</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-900">Integration</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Add BotForge to your website with a single snippet</p>
      </div>

      <div className="flex gap-8 flex-1 min-h-[500px]">
        {/* Left Column: Instructions */}
        <div className="w-1/2 space-y-6">
          {/* Install */}
          <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-neutral-400" />
                <h2 className="text-[13px] font-semibold text-neutral-900">Embed Snippet</h2>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-700 transition-colors px-2.5 py-1 rounded-md border border-neutral-200 hover:bg-neutral-50"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            
            <div className="bg-[#1a1a2e] p-5">
              <pre className="text-[13px] font-mono leading-relaxed overflow-x-auto">
                <code>
                  <span style={{ color: '#7c7c9a' }}>{"<!-- Add before </body> -->"}</span>{"\n"}
                  <span style={{ color: '#89ddff' }}>&lt;</span>
                  <span style={{ color: '#ef9062' }}>script</span>{"\n"}
                  <span style={{ color: '#c792ea' }}>  src</span>
                  <span style={{ color: '#89ddff' }}>=</span>
                  <span style={{ color: '#c3e88d' }}>"http://localhost:5001/widget.js"</span>{"\n"}
                  <span style={{ color: '#c792ea' }}>  data-api-key</span>
                  <span style={{ color: '#89ddff' }}>=</span>
                  <span style={{ color: '#c3e88d' }}>"{org?.apiKey}"</span>
                  <span style={{ color: '#89ddff' }}>&gt;</span>{"\n"}
                  <span style={{ color: '#89ddff' }}>&lt;/</span>
                  <span style={{ color: '#ef9062' }}>script</span>
                  <span style={{ color: '#89ddff' }}>&gt;</span>
                </code>
              </pre>
            </div>
          </div>

          {/* API Key */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5">
            <h3 className="text-[13px] font-semibold text-neutral-900 mb-1">API Key</h3>
            <p className="text-[12px] text-neutral-400 mb-3">Used to authenticate widget requests to your workspace.</p>
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5">
              <code className="text-[13px] font-mono text-neutral-700 break-all">{org?.apiKey}</code>
            </div>
            <p className="text-[11px] text-neutral-400 mt-2">This key is public-safe. Your Gemini secret key is stored server-side only.</p>
          </div>

          {/* Steps */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5">
            <h3 className="text-[13px] font-semibold text-neutral-900 mb-4">Installation Steps</h3>
            <ol className="space-y-3">
              {[
                { step: "1", text: "Copy the embed snippet above" },
                { step: "2", text: "Paste it before the closing </body> tag of your website" },
                { step: "3", text: "The chat widget will appear automatically in the bottom-right corner" },
              ].map((s) => (
                <li key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-[11px] font-bold text-neutral-500 shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <span className="text-[13px] text-neutral-600">{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-neutral-900">Live Preview</h3>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sandbox Active
            </span>
          </div>
          <div className="flex-1 bg-white border border-neutral-200/80 rounded-xl overflow-hidden relative shadow-sm">
            <iframe
              title="Widget Preview Sandbox"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      body { 
                        margin: 0; 
                        font-family: system-ui, -apple-system, sans-serif; 
                        background: #fafafa;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        overflow: hidden;
                      }
                      .mock-content {
                        max-width: 400px;
                        text-align: center;
                      }
                      h1 { color: #111827; font-size: 24px; margin-bottom: 8px; font-weight: 600; tracking: -0.02em; }
                      p { color: #6b7280; font-size: 14px; line-height: 1.5; }
                      .mock-button {
                        margin-top: 24px;
                        padding: 10px 20px;
                        background: #111827;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="mock-content">
                      <h1>Your Website</h1>
                      <p>This is a sandboxed preview. The widget will appear in the bottom right corner exactly as it would on your site.</p>
                      <button class="mock-button">Test Button</button>
                    </div>
                    <script 
                      src="http://localhost:5001/widget.js" 
                      data-api-key="${org?.apiKey}">
                    </script>
                  </body>
                </html>
              `}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
