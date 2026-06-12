"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@gmail.com");
  const [password, setPassword] = React.useState("password");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    // Simulate authenticating network latency
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 font-sans">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white border border-border p-8 shadow-xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md flex items-center justify-center bg-white border border-border">
            <Image
              src="/logo.png"
              alt="SB2 Logo"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight" style={{ color: "#141c14" }}>
              Coach Purl Admin
            </h1>
            <p className="mt-1 text-sm text-foreground">
              Sign in to manage your Mental Health support platform
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md">
            <div className="space-y-1">
              <label htmlFor="email-address" className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-border px-4 py-3 text-base text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder="admin@gmail.com"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-border pl-4 pr-12 py-3 text-base text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-foreground/60 hover:text-foreground cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <MdVisibilityOff className="w-5 h-5" />
                  ) : (
                    <MdVisibility className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-ring accent-primary"
              />
              <label htmlFor="remember-me" className="ml-2 text-foreground font-medium">
                Remember me
              </label>
            </div>
            
            <a href="#" className="font-semibold text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 text-base"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying credentials...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
