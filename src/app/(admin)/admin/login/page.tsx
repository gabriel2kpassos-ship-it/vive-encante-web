"use client";

import { useMemo, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { ADMIN_USERNAME_MAP, ADMIN_DOMAIN_FALLBACK } from "@/config/site";

function resolveLoginToEmail(input: string): string {
  const value = input.trim().toLowerCase();

  if (value.includes("@")) return value;

  if (ADMIN_USERNAME_MAP[value]) {
    return ADMIN_USERNAME_MAP[value];
  }

  return value + ADMIN_DOMAIN_FALLBACK;
}

function getNextPath(): string {
  if (typeof window === "undefined") return "/admin";
  const url = new URL(window.location.href);
  return url.searchParams.get("next") || "/admin";
}

export default function AdminLoginPage() {
  const nextPath = useMemo(() => getNextPath(), []);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const email = resolveLoginToEmail(login);

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/admin/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Login failed");
      }

      window.location.href = nextPath;
    } catch (err: any) {
      setError(err?.code || err?.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-sky-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="Viva & Encante"
            className="h-24 object-contain"
          />
        </div>

        <h1 className="mt-4 text-center text-2xl font-bold text-gray-800">
          Área Administrativa
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">Acesso restrito</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Usuário</label>
            <input
              className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-12 text-gray-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-pink-400 to-sky-400 py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
