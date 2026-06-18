import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import api from "../lib/axios";
import { MessageSquare, FileText, Key, Zap, TrendingUp, ArrowUpRight, Clock, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Mon', queries: 420 },
  { day: 'Tue', queries: 310 },
  { day: 'Wed', queries: 540 },
  { day: 'Thu', queries: 470 },
  { day: 'Fri', queries: 690 },
  { day: 'Sat', queries: 220 },
  { day: 'Sun', queries: 280 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 text-white text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg">
      {label}: <span className="font-bold">{payload[0].value}</span>
    </div>
  );
};

export default function Dashboard() {
  const org = useAuthStore((s) => s.org);
  const [stats, setStats] = useState({ chatCount: 0, docCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [meRes, docsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/documents"),
        ]);
        setStats({
          chatCount: meRes.data.chatCount || 0,
          docCount: docsRes.data.length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const metrics = [
    { label: "Conversations", value: stats.chatCount, icon: MessageSquare, change: "+12%", up: true },
    { label: "Documents", value: stats.docCount, icon: FileText, change: `${stats.docCount}`, up: true },
    { label: "Plan", value: org?.plan || "Pro", icon: Zap, change: "Active", up: false },
    { label: "API Key", value: org?.hasOwnKey ? "Custom" : "Default", icon: Key, change: org?.hasOwnKey ? "BYOK" : "Shared", up: false },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-900">Overview</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Welcome back, {org?.name}</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-neutral-200/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <m.icon className="w-4 h-4 text-neutral-400" />
              {m.up && (
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />{m.change}
                </span>
              )}
              {!m.up && (
                <span className="text-[11px] font-medium text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">
                  {m.change}
                </span>
              )}
            </div>
            <p className="text-[26px] font-bold tracking-tight text-neutral-900 leading-none">{m.value}</p>
            <p className="text-[12px] font-medium text-neutral-400 mt-1.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 bg-white border border-neutral-200/80 rounded-xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[14px] font-semibold text-neutral-900">Query Volume</h2>
            <span className="text-[11px] font-medium text-neutral-400">Last 7 days</span>
          </div>
          <p className="text-[12px] text-neutral-400 mb-5">Messages processed by your chatbot</p>
          
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#171717" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#171717" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#a3a3a3', fontWeight: 500 }}
                  dy={8}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#a3a3a3', fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Area
                  type="monotone"
                  dataKey="queries"
                  stroke="#171717"
                  strokeWidth={1.5}
                  fill="url(#grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Getting started */}
        <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-xl p-6 flex flex-col">
          <h2 className="text-[14px] font-semibold text-neutral-900 mb-1">Getting Started</h2>
          <p className="text-[12px] text-neutral-400 mb-5">Complete these steps to go live</p>

          <div className="space-y-4 flex-1">
            {[
              { step: 1, title: "Upload documents", desc: "Add your knowledge base", done: stats.docCount > 0 },
              { step: 2, title: "Customize widget", desc: "Match your brand identity", done: false },
              { step: 3, title: "Embed on your site", desc: "Add the script tag", done: false },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                  s.done
                    ? "bg-neutral-900 text-white"
                    : "border-2 border-neutral-200 text-neutral-400"
                }`}>
                  {s.done ? "✓" : s.step}
                </div>
                <div>
                  <p className={`text-[13px] font-medium leading-tight ${s.done ? "text-neutral-400 line-through" : "text-neutral-900"}`}>{s.title}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-neutral-500">
                {stats.docCount > 0 ? "1" : "0"} of 3 completed
              </span>
              <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-neutral-900 rounded-full transition-all" 
                  style={{ width: `${(stats.docCount > 0 ? 1 : 0) / 3 * 100}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
