"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Compass,
  ArrowUpDown,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import CollegeCard from "@/components/college-card";
import { useToastStore } from "@/store/toastStore";
import { College } from "@/types";

export default function CollegeListingPage() {
  const { addToast } = useToastStore();

  // Search & Filters State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stream, setStream] = useState("all");
  const [location, setLocation] = useState("all");
  const [fees, setFees] = useState("all");
  const [rating, setRating] = useState("all");

  // Sorting & Pagination State
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Custom inline search debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Query Colleges using TanStack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "colleges",
      debouncedSearch,
      stream,
      location,
      fees,
      rating,
      sortBy,
      sortDir,
      page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: debouncedSearch,
        stream,
        location,
        fees,
        rating,
        sortBy,
        sortDir,
        page: page.toString(),
        limit: "9",
      });
      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  const colleges = data?.data || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, totalCount: 0 };

  // Indian locations listed in our database
  const popularLocations = [
    { name: "All Cities", value: "all" },
    { name: "Mumbai", value: "Mumbai" },
    { name: "New Delhi", value: "New Delhi" },
    { name: "Bangalore", value: "Bangalore" },
    { name: "Chennai", value: "Chennai" },
    { name: "Pune", value: "Pune" },
    { name: "Kolkata", value: "Kolkata" },
    { name: "Ahmedabad", value: "Ahmedabad" },
    { name: "Lucknow", value: "Lucknow" },
  ];

  const streams = [
    { name: "All Streams", value: "all" },
    { name: "Engineering", value: "Engineering" },
    { name: "Management", value: "Management" },
    { name: "Medical", value: "Medical" },
    { name: "Arts", value: "Arts" },
    { name: "Science", value: "Science" },
  ];

  const feeOptions = [
    { name: "Any Fees", value: "all" },
    { name: "Under ₹1 Lakh/yr", value: "under-1l" },
    { name: "₹1 Lakh - ₹3 Lakhs/yr", value: "1l-3l" },
    { name: "₹3 Lakhs - ₹5 Lakhs/yr", value: "3l-5l" },
    { name: "Above ₹5 Lakhs/yr", value: "above-5l" },
  ];

  const ratingOptions = [
    { name: "Any Rating", value: "all" },
    { name: "4.5 ★ & Above", value: "4.5" },
    { name: "4.0 ★ & Above", value: "4.0" },
    { name: "3.5 ★ & Above", value: "3.5" },
  ];

  const sortOptions = [
    { name: "Name", value: "name" },
    { name: "Fees", value: "fees" },
    { name: "Rating", value: "rating" },
    { name: "Placements", value: "placements" },
  ];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const toggleSortDirection = () => {
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStream("all");
    setLocation("all");
    setFees("all");
    setRating("all");
    setSortBy("name");
    setSortDir("asc");
    setPage(1);
    addToast("Filters reset successfully", "info");
  };

  return (
    <div className="flex-1 flex flex-col pb-20">
      
      {/* 1. Hero Platform Introduction */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent py-16 px-4 md:py-24 text-center">
        {/* Subtle glowing abstract blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-40 left-10 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 shadow-sm shadow-primary/5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Discovery Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-foreground"
          >
            Discover Your Perfect <br />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent text-glow-primary">
              Indian College Path
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mb-8 font-medium"
          >
            Explore, filter, and compare fees, rating stats, and real placement records across 50+ premium Indian universities. Tailor your higher education path with pure data.
          </motion.p>

          {/* Quick Platform Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl border border-border/60 bg-card/60 backdrop-blur-md p-6 rounded-2xl shadow-sm"
          >
            <div className="text-center">
              <p className="text-2xl font-extrabold text-foreground">50+</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Premium Indian Colleges</p>
            </div>
            <div className="text-center border-l border-border/40">
              <p className="text-2xl font-extrabold text-foreground">150+</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Detailed Courses</p>
            </div>
            <div className="text-center border-l border-border/40">
              <p className="text-2xl font-extrabold text-foreground">100%</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Verified Placements</p>
            </div>
            <div className="text-center border-l border-border/40">
              <p className="text-2xl font-extrabold text-foreground">5</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Specialized Streams</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Listing controls and search area */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Search input and action panel */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          
          {/* Main search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search colleges by name, city, state, or key descriptors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 shadow-sm transition-all duration-200"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 cursor-pointer w-full md:w-auto ${
                showFilters || stream !== "all" || location !== "all" || fees !== "all" || rating !== "all"
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-card text-foreground border-border hover:bg-muted/40"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(stream !== "all" || location !== "all" || fees !== "all" || rating !== "all") && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>

            {/* Reset Filters */}
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold px-4 py-3 border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-2xl cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Filters drawer panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Stream Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Course Stream</label>
                <select
                  value={stream}
                  onChange={(e) => {
                    setStream(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none"
                >
                  {streams.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Location (City)</label>
                <select
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none"
                >
                  {popularLocations.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fees Bracket */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Annual Fees</label>
                <select
                  value={fees}
                  onChange={(e) => {
                    setFees(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none"
                >
                  {feeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Star Rating */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Min Rating</label>
                <select
                  value={rating}
                  onChange={(e) => {
                    setRating(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none"
                >
                  {ratingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sorting bar & Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-border/40 pb-4">
          <p className="text-xs font-semibold text-muted-foreground">
            Showing <span className="font-extrabold text-foreground">{colleges.length}</span> colleges out of{" "}
            <span className="font-extrabold text-foreground">{pagination.totalCount}</span> registered
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort By:
            </span>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>

              <button
                onClick={toggleSortDirection}
                className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
                title={sortDir === "asc" ? "Sort Ascending" : "Sort Descending"}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Grid Display / Loader / Error */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* Loading Shimmer Skeletons */
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col w-full h-[460px] rounded-2xl border border-border bg-card overflow-hidden shimmer-effect">
                  <div className="w-full h-44 bg-muted" />
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="w-16 h-3 bg-muted rounded" />
                    <div className="w-3/4 h-5 bg-muted rounded mt-2" />
                    <div className="w-1/2 h-3.5 bg-muted rounded" />
                    <div className="grid grid-cols-2 gap-4 py-4 my-2 border-t border-b border-border/40">
                      <div className="h-8 bg-muted rounded" />
                      <div className="h-8 bg-muted rounded" />
                    </div>
                    <div className="flex gap-2 mb-4">
                      <div className="w-12 h-4 bg-muted rounded" />
                      <div className="w-12 h-4 bg-muted rounded" />
                    </div>
                    <div className="mt-auto flex justify-between h-8 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : isError ? (
            /* Error Recover Card */
            <motion.div
              key="error"
              className="p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/5 max-w-lg mx-auto"
            >
              <HelpCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Failed to query colleges</h3>
              <p className="text-xs text-muted-foreground mb-6">
                Our server encountered an issue while loading data. Please check your database migration or run seeds.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs"
              >
                Reload Page
              </button>
            </motion.div>
          ) : colleges.length === 0 ? (
            /* Custom Empty State Illustration */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center max-w-md mx-auto"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-glow-primary">
                <Compass className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No Colleges Found</h3>
              <p className="text-xs text-muted-foreground mb-6">
                We couldn&apos;t find any Indian colleges matching your specific filters. Try lowering your criteria or resetting your search bar.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs cursor-pointer"
              >
                Reset Search Filters
              </button>
            </motion.div>
          ) : (
            /* Core College Grid */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {colleges.map((college: College) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Pagination panel */}
        {pagination.totalPages > 1 && !isLoading && !isError && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold text-muted-foreground">
              Page <span className="font-extrabold text-foreground">{page}</span> of{" "}
              <span className="font-extrabold text-foreground">{pagination.totalPages}</span>
            </span>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </section>

    </div>
  );
}
