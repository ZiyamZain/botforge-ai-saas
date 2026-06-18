import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { MessageSquare, User, Clock, TrendingUp, ChevronDown, ChevronRight } from "lucide-react";

export default function Analytics() {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["chat-history"],
    queryFn: () => api.get("/chat/history").then((r) => r.data),
  });

  const totalMessages = sessions.reduce(
    (acc: number, s: any) => acc + s.messages.length,
    0,
  );
  const avgMsgs = sessions.length ? Math.round(totalMessages / sessions.length) : 0;

  const stats = [
    { label: "Total Sessions", value: sessions.length, icon: User },
    { label: "Total Messages", value: totalMessages, icon: MessageSquare },
    { label: "Avg per Session", value: avgMsgs, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-900">Analytics</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Conversation history and usage metrics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-neutral-200/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-4 h-4 text-neutral-400" />
            </div>
            <p className="text-[26px] font-bold tracking-tight text-neutral-900 leading-none">{value}</p>
            <p className="text-[12px] font-medium text-neutral-400 mt-1.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Sessions */}
      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-neutral-900">Conversations</h2>
          <span className="text-[11px] font-medium text-neutral-400">{sessions.length} sessions</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-neutral-400 text-[13px]">Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-neutral-200" />
            <p className="text-neutral-400 text-[13px]">No conversations yet</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {sessions.map((session: any) => (
              <details key={session.id} className="group">
                <summary className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-neutral-50/70 transition-colors list-none">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-neutral-100 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-neutral-700">
                        Session {session.id.slice(-6)}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {session.messages.length} messages · {new Date(session.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-open:rotate-90 transition-transform" />
                </summary>

                <div className="px-5 pb-4 pt-1 space-y-2 bg-neutral-50/50">
                  {session.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[320px] px-3.5 py-2 rounded-xl text-[13px] leading-relaxed ${
                          msg.role === "USER"
                            ? "bg-neutral-900 text-white"
                            : "bg-white border border-neutral-200 text-neutral-700"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
