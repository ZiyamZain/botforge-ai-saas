import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../lib/axios";
import { useAuthStore } from "../store/authStore";
import { Bot } from "lucide-react";

const schema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      const res = await api.post("/auth/login", data);
      setAuth(res.data.org, res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-[380px] px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.02em]">BotForge</span>
          </Link>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-7 shadow-sm">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-center mb-1">Welcome back</h1>
          <p className="text-[13px] text-neutral-500 text-center mb-6">Sign in to your dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-[12px] font-medium text-neutral-600 mb-1.5 block">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@company.com"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-[12px] font-medium text-neutral-600 mb-1.5 block">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
              />
              {errors.password && (
                <p className="text-red-500 text-[11px] mt-1">{errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-red-500 text-[12px] bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-neutral-900 text-white py-2.5 rounded-lg text-[13px] font-semibold hover:bg-neutral-800 disabled:opacity-40 transition-colors"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-neutral-500 mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-neutral-900 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
