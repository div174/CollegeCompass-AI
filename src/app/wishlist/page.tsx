"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Sparkles, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import CollegeCard from "@/components/college-card";
import { College } from "@/types";

export default function WishlistPage() {
  const { status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setIsMounted(true);
  }, []);

  // TanStack Query for saved colleges
  const { data, isLoading, isError } = useQuery({
    queryKey: ["saved-colleges"],
    queryFn: async () => {
      const res = await fetch("/api/saved");
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const result = await res.json();
      return result.data as College[];
    },
    enabled: status === "authenticated",
  });

  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not Logged In State
  if (status === "unauthenticated") {
    return (
      <div className="flex-1 max-w-md mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-3xl bg-rose-500/10 text-rose-500 mb-6">
          <Bookmark className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">Sign In Required</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Please sign in to your student account to save colleges, construct custom wishlists, and manage university profiles.
        </p>
        <Link
          href="/auth/signin?callbackUrl=/wishlist"
          className="w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Sign In Now
          <ArrowRight className="w-4.5 h-4.5" />
        </Link>
      </div>
    );
  }

  // Session Loading or Query Loading
  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Loading your wishlist...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 max-w-md mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400">Failed to Load Wishlist</h2>
        <p className="text-muted-foreground text-sm mt-2 mb-6">
          There was an error communicating with the database. Please try again.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/95 transition-all cursor-pointer"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const savedColleges = data || [];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1.5 uppercase tracking-wide">
            <Sparkles className="w-4 h-4" />
            Saved Universities
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Wishlist ({savedColleges.length})
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and compare all Indian universities you saved for future admissions reviews.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>
      </div>

      {/* Grid Content */}
      {savedColleges.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-16 text-center max-w-md mx-auto mt-10">
          <Bookmark className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-1">Your wishlist is empty</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-6">
            Explore colleges on our platform and bookmark your top choices to keep track of their placement dates, annual fees, and reviews.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/95 transition-all cursor-pointer"
          >
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((college) => (
            <CollegeCard key={college.id} college={college} isInitiallySaved={true} />
          ))}
        </div>
      )}

    </div>
  );
}
