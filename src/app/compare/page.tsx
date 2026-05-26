"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GitCompare,
  Trash2,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Star,
} from "lucide-react";
import { useComparisonStore } from "@/store/comparisonStore";
import { useToastStore } from "@/store/toastStore";

export default function ComparePage() {
  const { selectedColleges, removeCollege, clearComparison } = useComparisonStore();
  const { addToast } = useToastStore();
  const [isMounted, setIsMounted] = useState(false);

  // Mount guard to prevent hydration mismatch for localStorage state
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleRemove = (id: string, name: string) => {
    removeCollege(id);
    addToast(`${name} removed from comparison.`, "success");
  };

  const handleClearAll = () => {
    clearComparison();
    addToast("Comparison board cleared.", "info");
  };

  // Features list to check and compare
  const featuresToCompare = [
    { label: "Stream", key: "stream", icon: GraduationCap },
    { label: "Location", key: "location", icon: MapPin },
    { label: "State", key: "state", icon: MapPin },
    { label: "Established", key: "established", icon: Calendar },
    { label: "Type", key: "type", icon: Building },
    { label: "Overall Rating", key: "rating", icon: Star, highlight: true },
    { label: "Average Fees (Annual)", key: "averageFees", isCurrency: true },
    { label: "Average Placement (LPA)", key: "averagePlacement", isLpa: true, highlight: true },
    { label: "Highest Placement (LPA)", key: "highestPlacement", isLpa: true, highlight: true },
  ];

  if (selectedColleges.length === 0) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-3xl bg-primary/10 text-primary mb-6 animate-bounce-slow">
          <GitCompare className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">Compare Board is Empty</h1>
        <p className="text-muted-foreground text-sm max-w-md mb-8">
          Add up to 3 colleges from the Explore dashboard to compare their fees, ratings, programs, and average placement packages side-by-side.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore Colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1.5 uppercase tracking-wide">
            <Sparkles className="w-4 h-4" />
            Comparison Matrix
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Side-by-Side Comparison
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyzing {selectedColleges.length} selected {selectedColleges.length === 1 ? "university" : "universities"} for admissions and placements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
          >
            Add More
          </Link>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
          >
            Clear Board
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        
        {/* Metric Names Column (Hidden on Mobile, shown as labels inside cards instead) */}
        <div className="hidden md:flex flex-col border-r border-border bg-muted/10">
          <div className="h-44 p-6 border-b border-border flex flex-col justify-end">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">University Details</span>
          </div>
          {featuresToCompare.map((feat) => (
            <div
              key={feat.label}
              className={`h-16 px-6 border-b border-border flex items-center gap-2 text-sm font-medium ${
                feat.highlight ? "text-primary bg-primary/5" : "text-muted-foreground"
              }`}
            >
              {feat.icon && <feat.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              {feat.label}
            </div>
          ))}
          <div className="h-20 px-6 flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Action
          </div>
        </div>

        {/* Colleges Columns */}
        {selectedColleges.map((college) => (
          <div key={college.id} className="flex flex-col border-b md:border-b-0 md:border-r border-border last:border-r-0 relative group">
            
            {/* Header / Basic Info */}
            <div className="h-44 p-6 border-b border-border flex flex-col justify-between">
              <button
                onClick={() => handleRemove(college.id, college.name)}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Remove from comparison"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                  {college.stream}
                </span>
                <Link
                  href={`/college/${college.id}`}
                  className="block font-bold text-base mt-2 text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
                >
                  {college.name}
                </Link>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {college.location}, {college.state}
                </span>
              </div>
            </div>

            {/* Features Rows */}
            {featuresToCompare.map((feat) => {
              const val = college[feat.key as keyof typeof college];
              
              let displayVal: React.ReactNode = "";
              if (feat.isCurrency && typeof val === "number") {
                displayVal = `₹${(val / 100000).toFixed(1)} Lakh / year`;
              } else if (feat.isLpa && typeof val === "number") {
                displayVal = `${val} LPA`;
              } else if (feat.key === "rating") {
                displayVal = (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{college.rating} / 5.0</span>
                  </div>
                );
              } else if (typeof val === "string" || typeof val === "number") {
                displayVal = val;
              }

              return (
                <div
                  key={feat.label}
                  className={`h-16 px-6 border-b border-border flex items-center md:justify-start justify-between text-sm ${
                    feat.highlight ? "bg-primary/5 font-semibold text-foreground" : "text-foreground"
                  }`}
                >
                  {/* Label shown only on mobile */}
                  <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                    {feat.icon && <feat.icon className="w-3.5 h-3.5" />}
                    {feat.label}:
                  </span>
                  <span>{displayVal}</span>
                </div>
              );
            })}

            {/* Actions Row */}
            <div className="h-20 px-6 flex items-center gap-2">
              <Link
                href={`/college/${college.id}`}
                className="w-full text-center px-4 py-2 text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/95 shadow-sm rounded-xl transition-all"
              >
                View Full Profile
              </Link>
            </div>

          </div>
        ))}

        {/* Empty Placeholder Columns if < 3 colleges */}
        {Array.from({ length: Math.max(0, 3 - selectedColleges.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="hidden md:flex flex-col border-r border-border last:border-r-0 bg-muted/5 items-center justify-center p-6 text-center">
            <div className="p-3 rounded-full border border-dashed border-border text-muted-foreground mb-3">
              <GitCompare className="w-5 h-5 opacity-40 animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground max-w-[150px]">
              Add another university from exploration to compare side-by-side.
            </p>
            <Link
              href="/"
              className="mt-4 px-3 py-1.5 text-[10px] font-bold rounded-lg border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors"
            >
              Find Colleges
            </Link>
          </div>
        ))}

      </div>
    </div>
  );
}
