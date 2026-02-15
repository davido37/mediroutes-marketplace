"use client";

import { useState, type FormEvent } from "react";
import { VendorLogo } from "@/components/common/vendor-logo";

interface LandingPageProps {
  onAuthenticate: (password: string) => boolean;
}

export function LandingPage({ onAuthenticate }: LandingPageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(false);
    setLoading(true);

    // Small delay for perceived feedback
    setTimeout(() => {
      const ok = onAuthenticate(password);
      if (!ok) {
        setError(true);
        setPassword("");
      }
      setLoading(false);
    }, 400);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 animate-[fadeIn_0.5s_ease-out]">
      <div className="w-full max-w-sm mx-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
        {/* Branding */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <VendorLogo vendor="mediroutes" size={56} />
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
            NEMT Command Central
          </h1>
          <p className="text-sm text-slate-400 text-center leading-relaxed">
            MediRoutes Marketplace Prototype
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="demo-password" className="sr-only">
              Demo Password
            </label>
            <input
              id="demo-password"
              type="password"
              placeholder="Enter demo password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
            />
            {error && (
              <p className="mt-2 text-xs text-red-400">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              "Enter Demo"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-slate-600">
          Prototype — Mock Data Only
        </p>
      </div>
    </div>
  );
}
