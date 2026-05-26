"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Calendar,
  IndianRupee,
  Briefcase,
  GitCompare,
  ArrowRight,
  Shield,
  Layers,
  Compass,
} from "lucide-react";
import { College } from "@/types";
import { useComparisonStore } from "@/store/comparisonStore";
import { useToastStore } from "@/store/toastStore";

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { addCollege, removeCollege, isCompared } = useComparisonStore();
  const { addToast } = useToastStore();
  const compared = isCompared(college.id);

  // Toggle Comparison board state
  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (compared) {
      removeCollege(college.id);
      addToast(`${college.name.split(" (")[0]} removed from comparison.`, "info");
    } else {
      const result = addCollege(college);
      if (result.success) {
        addToast(result.message, "success");
      } else {
        addToast(result.message, "error");
      }
    }
  };

  // Render first few comma-separated facilities
  const facilityList = college.facilities
    ? college.facilities.split(",").slice(0, 3)
    : [];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col w-full h-[460px] rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
    >
      {/* Top Banner and cover image */}
      <div className="relative w-full h-44 overflow-hidden bg-muted">
        {college.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={college.coverUrl}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
            <Compass className="w-12 h-12 text-white/20 animate-spin-slow" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Stream Badges and established year */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center gap-1">
            <Layers className="w-3 h-3 text-primary" />
            {college.stream}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            Est. {college.established}
          </span>
        </div>



        {/* Rating chip in bottom right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md border border-white/10 text-xs font-bold">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          {college.rating.toFixed(1)}
        </div>

        {/* Logo overlapping banner */}
        <div className="absolute -bottom-6 left-4 w-12 h-12 rounded-xl bg-card border border-border shadow-md overflow-hidden flex items-center justify-center p-1">
          {college.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={college.logoUrl} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <Compass className="w-6 h-6 text-primary" />
          )}
        </div>
      </div>

      {/* College Info Body */}
      <div className="flex-1 flex flex-col p-4 pt-8">
        
        {/* Type (Public/Private) */}
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1 mb-1">
          <Shield className="w-3.5 h-3.5" />
          {college.type} Institute
        </span>

        {/* Title */}
        <Link href={`/college/${college.id}`} className="block">
          <h3 className="font-bold text-base text-foreground line-clamp-2 hover:text-primary transition-colors leading-tight min-h-[44px]">
            {college.name}
          </h3>
        </Link>

        {/* Location */}
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          {college.location}, {college.state}
        </p>

        {/* Key comparison metrics Grid */}
        <div className="grid grid-cols-2 gap-3.5 border-t border-b border-border/60 py-3.5 my-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Avg Fees</p>
              <p className="text-xs font-extrabold mt-0.5 text-foreground">
                ₹{(college.averageFees / 100000).toFixed(1)} Lakhs<span className="text-[9px] font-medium text-muted-foreground">/yr</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Avg Placement</p>
              <p className="text-xs font-extrabold mt-0.5 text-foreground">
                {college.averagePlacement.toFixed(1)} LPA
              </p>
            </div>
          </div>
        </div>

        {/* Facilities Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {facilityList.map((facility) => (
            <span
              key={facility}
              className="text-[9px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground"
            >
              {facility}
            </span>
          ))}
          {college.facilities.split(",").length > 3 && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
              +{college.facilities.split(",").length - 3} more
            </span>
          )}
        </div>

        {/* Action Tray */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-3 border-t border-border/40">
          
          {/* Compare check button */}
          <button
            onClick={handleToggleCompare}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              compared
                ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/30 font-bold"
                : "bg-muted/10 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            {compared ? "Comparing" : "Compare"}
          </button>

          {/* View details */}
          <Link
            href={`/college/${college.id}`}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-foreground hover:bg-primary px-3 py-1.5 rounded-xl transition-all duration-200"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </motion.div>
  );
}
