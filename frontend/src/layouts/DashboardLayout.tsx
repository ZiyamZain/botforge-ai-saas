import { useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../lib/axios";
import {
  LayoutDashboard,
  FileText,
  Code2,
  Settings,
  BarChart2,
  LogOut,
  Bot,
  ChevronsUpDown,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/dashboard/documents", icon: FileText, label: "Documents", end: false },
  { to: "/dashboard/embed", icon: Code2, label: "Integration", end: false },
  { to: "/dashboard/analytics", icon: BarChart2, label: "Analytics", end: false },
  { to: "/dashboard/settings", icon: Settings, label: "Settings", end: false },
];

export default function DashboardLayout() {
  const { org, logout, token, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!org && token) {
      api.get("/auth/me").then((res) => {
        setAuth(res.data, token);
      }).catch(() => {
        logout();
        navigate("/login");
      });
    }
  }, [org, token, setAuth, logout, navigate]);

  const currentPage = navItems.find(
    (item) => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );

  if (!org) {
    return <div className="flex h-screen items-center justify-center bg-[#fafafa]">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-[#fafafa]">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-[240px] bg-white border-r border-neutral-200/80 flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-[52px] flex items-center px-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">BotForge</span>
          </div>
        </div>

        {/* Workspace */}
        <div className="px-3 pt-3 pb-2">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neutral-50 transition-colors group text-left">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              {org?.name?.charAt(0).toUpperCase() || "W"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-neutral-900 truncate leading-tight">{org?.name || "Workspace"}</p>
              <p className="text-[11px] text-neutral-400 leading-tight">{org?.plan || "Pro"} plan</p>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-400 shrink-0" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-1 space-y-0.5">
          <p className="px-2.5 pt-3 pb-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.05em]">Menu</p>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
                }`
              }
            >
              <Icon className="w-[15px] h-[15px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-3 mt-auto">
          <div className="border-t border-neutral-100 pt-3">
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-colors w-full"
            >
              <LogOut className="w-[15px] h-[15px]" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-[52px] bg-white border-b border-neutral-200/80 flex items-center px-8 shrink-0">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-neutral-400">Dashboard</span>
            {currentPage && currentPage.label !== "Overview" && (
              <>
                <span className="text-neutral-300">/</span>
                <span className="text-neutral-900 font-medium">{currentPage.label}</span>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1040px] mx-auto px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
