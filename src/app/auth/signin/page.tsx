"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, Sparkles, AlertCircle, ArrowLeft, Loader2, ArrowRight } from "lucide-react";
import { useToastStore } from "@/store/toastStore";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Get callbackUrl from params or default to home
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Check for NextAuth default errors in URL query
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "OAuthSignin" || errorParam === "OAuthCallback") {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setError("An error occurred during Google OAuth. Please check your credentials.");
    } else if (errorParam === "CredentialsSignin") {
      setError("Incorrect email or password. Please try again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error || "Invalid login credentials.");
        addToast(res.error || "Login failed.", "error");
      } else {
        addToast("Logged in successfully! Welcome back.", "success");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (err) {
      console.error(err);
      setError("Failed to initiate Google sign-in.");
      setGoogleLoading(false);
    }
  };

  // Pre-fill dummy seeded credentials for recruiter's ease of testing!
  const handleQuickFill = () => {
    setEmail("student@campuscompass.ai");
    setPassword("password123");
    addToast("Recruiter credentials auto-filled! Click 'Sign In with Email' to log in.", "info");
  };

  return (
    <div className="flex-1 min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-950/30 via-background to-purple-950/20">
      <div className="max-w-md w-full">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        {/* Brand Card Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome to CampusCompass
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            AI-powered college search & analytics tailored for Indian students.
          </p>
        </div>

        {/* Credentials Form Container */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-indigo-500" />
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex gap-2.5 items-start">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Sign In Failed</p>
                <p className="mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campuscompass.ai"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Sign In with Email
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Recruiter Quick Fill Action (Highly Impressive!) */}
          <div className="mt-5 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wide mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Recruiter Quick-Test
            </span>
            <p className="text-[11px] text-muted-foreground leading-snug max-w-xs mx-auto mb-3">
              We pre-seeded a full student account in your Neon DB. Click below to auto-fill details!
            </p>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-4 py-1.5 text-xs font-bold rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              Auto-Fill Credentials
            </button>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <span className="relative px-3 bg-card text-xs text-muted-foreground uppercase tracking-wide font-medium">
              or connect with
            </span>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full py-3 px-4 rounded-xl border border-border bg-background hover:bg-muted/30 text-sm font-semibold text-foreground transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : (
              // Google Icon
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.13h4.01c2.34-2.16 3.68-5.32 3.68-8.75z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.01-3.13c-1.12.75-2.54 1.19-3.92 1.19-3.02 0-5.58-2.04-6.5-4.78H1.38v3.24A11.98 11.98 0 0 0 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.5 14.38a7.16 7.16 0 0 1 0-4.56V6.58H1.38a11.98 11.98 0 0 0 0 11.04l4.12-3.24z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.92 11.92 0 0 0 12 0 11.98 11.98 0 0 0 1.38 6.58l4.12 3.24c.92-2.74 3.48-4.78 6.5-4.78z"
                />
              </svg>
            )}
            Sign In with Google
          </button>

        </div>
      </div>
    </div>
  );
}
