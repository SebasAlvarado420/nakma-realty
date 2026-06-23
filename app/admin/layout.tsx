"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }
    // Never hang on a loading screen: if Supabase is unreachable (e.g. the free
    // project is paused) getSession() can reject or stall — fall back to the
    // login screen instead of spinning forever.
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null));
    const safety = setTimeout(
      () => setSession((s) => (s === undefined ? null : s)),
      8000
    );
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      clearTimeout(safety);
      sub.subscription.unsubscribe();
    };
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  async function logout() {
    await supabase?.auth.signOut();
  }

  // Loading
  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f2e8]">
        <p className="nakma-body text-sm uppercase tracking-[0.28em] text-[#8b6d3b]">
          Loading…
        </p>
      </div>
    );
  }

  // Login screen
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f2e8] px-6">
        <form
          onSubmit={login}
          className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-xl sm:p-10"
        >
          <p className="nakma-body text-[11px] uppercase tracking-[0.32em] text-[#8b6d3b]">
            NAKMA Realty
          </p>
          <h1 className="nakma-display mt-3 text-3xl text-[#163126]">Admin Dashboard</h1>
          <p className="nakma-body mt-2 text-sm text-[#5d7268]">
            Sign in to manage your property listings.
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-2xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#8b6d3b]"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-2xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#8b6d3b]"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl bg-[#163126] py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Authenticated
  return (
    <div className="relative">
      <button
        type="button"
        onClick={logout}
        className="nakma-body fixed right-5 top-[84px] z-[120] rounded-full border border-[#163126]/20 bg-white/90 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-[#163126] shadow-md backdrop-blur-sm transition hover:bg-[#163126] hover:text-white"
      >
        Sign out
      </button>
      {children}
    </div>
  );
}
