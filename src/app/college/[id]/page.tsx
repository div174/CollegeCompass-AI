"use client";

import React, { use, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Star,
  MapPin,
  Briefcase,
  Bookmark,
  GitCompare,
  CheckCircle,
  Building,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Send,
  Loader2,
  Users,
} from "lucide-react";
import { useComparisonStore } from "@/store/comparisonStore";
import { useToastStore } from "@/store/toastStore";
import { College, Course, Review } from "@/types";

import PlacementChart from "@/components/placement-chart";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CollegeDetailPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const collegeId = unwrappedParams.id;
  const { data: session } = useSession();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const { addCollege, removeCollege, isCompared } = useComparisonStore();

  const [activeTab, setActiveTab] = useState("overview");
  const compared = isCompared(collegeId);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setIsMounted(true);
  }, []);

  // Review states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Wishlist state
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch College Detail
  const { data, isLoading, isError } = useQuery({
    queryKey: ["college", collegeId],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${collegeId}`);
      if (!res.ok) throw new Error("Failed to fetch college details");
      const json = await res.json();
      return json.data;
    },
  });

  // Verify wishlist status on load
  useEffect(() => {
    if (session && data) {
      const fetchSavedStatus = async () => {
        try {
          const res = await fetch("/api/saved");
          const result = await res.json();
          if (result.success) {
            const savedList = result.data || [];
            setIsSaved(savedList.some((item: College) => item.id === collegeId));
          }
        } catch (err) {
          console.error("Failed to fetch wishlist status:", err);
        }
      };
      fetchSavedStatus();
    }
  }, [session, data, collegeId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8 animate-pulse">
        <div className="h-64 bg-muted/30 rounded-2xl border border-border" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-muted/20 rounded-2xl" />
          <div className="h-80 bg-muted/20 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <Compass className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-spin-slow" />
        <h3 className="text-xl font-bold text-foreground mb-2">College Not Found</h3>
        <p className="text-sm text-muted-foreground mb-6">
          The college ID does not exist or may have been removed. Let&apos;s go back to exploration.
        </p>
        <Link href="/" className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs">
          Back to Listings
        </Link>
      </div>
    );
  }

  const college = data;

  // Toggle Save Wishlist
  const handleToggleSave = async () => {
    if (!session) {
      addToast("Please sign in to save colleges to your wishlist", "info");
      return;
    }

    setSaveLoading(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      });
      const result = await res.json();
      if (result.success) {
        setIsSaved(result.saved);
        addToast(result.message, "success");
      } else {
        addToast(result.error || "Failed to update wishlist", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("An error occurred. Please try again.", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  // Toggle Comparison
  const handleToggleCompare = () => {
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

  // Review Posting
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      addToast("Please sign in to post a review", "info");
      return;
    }
    if (newComment.trim().length < 5) {
      addToast("Comment must be at least 5 characters long", "error");
      return;
    }

    setReviewLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeId: college.id,
          rating: newRating,
          comment: newComment,
        }),
      });
      const result = await res.json();
      if (result.success) {
        addToast(result.message, "success");
        setNewComment("");
        setNewRating(5);
        // Refresh detail query to show the newly added review instantly!
        queryClient.invalidateQueries({ queryKey: ["college-detail", collegeId] });
      } else {
        addToast(result.error || "Failed to submit review", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("An error occurred.", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "courses", label: "Courses & Fees" },
    { id: "placements", label: "Placements" },
    { id: "reviews", label: `Reviews (${college.reviews?.length || 0})` },
    { id: "facilities", label: "Facilities" },
  ];

  return (
    <div className="flex-grow flex flex-col">
      {/* 1. Header Hero Banner */}
      <section className="relative w-full h-[320px] bg-muted">
        {college.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={college.coverUrl} alt={college.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 via-indigo-950/40 to-purple-950/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl border border-border/80 bg-card p-2 shadow-lg flex items-center justify-center flex-shrink-0 z-10 backdrop-blur-md">
              {college.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={college.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Compass className="w-10 h-10 text-primary" />
              )}
            </div>

            {/* Title & Info */}
            <div className="z-10">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-primary text-primary-foreground">
                  {college.stream}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-muted text-muted-foreground border border-border">
                  {college.type}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight max-w-3xl leading-none">
                {college.name}
              </h1>
              <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mt-2">
                <MapPin className="w-4 h-4" />
                {college.location}, {college.state}
              </p>
            </div>
          </div>

          {/* Quick Rating breakdown */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card/60 border border-border backdrop-blur-md shadow-sm z-10">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <p className="text-sm font-extrabold leading-none">{college.rating.toFixed(1)} / 5.0</p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase leading-none mt-1">
                {college.reviews?.length || 0} Student Reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Page Content Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Tab panel & Detail content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Tabs bar */}
          <div className="border-b border-border flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-3.5 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="detail-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content panel */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* A. Overview Tab */}
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Building className="w-5 h-5 text-primary" />
                        About the Institution
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                        {college.description}
                      </p>
                    </div>

                    {/* Campus Gallery */}
                    <div className="flex flex-col gap-4 mt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Campus Gallery</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-44 rounded-xl bg-muted overflow-hidden border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&fit=crop&q=80"
                            alt="Campus Building"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="h-44 rounded-xl bg-muted overflow-hidden border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&fit=crop&q=80"
                            alt="Student Library"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* B. Courses and Fees Tab */}
                {activeTab === "courses" && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Offered Courses & Fee Structure
                    </h2>
                    
                    {/* Courses Listing Table */}
                    <div className="w-full overflow-hidden border border-border rounded-2xl bg-card shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead className="bg-muted/40 border-b border-border text-muted-foreground font-bold">
                            <tr>
                              <th className="p-4">Course / Degree</th>
                              <th className="p-4 text-center">Duration</th>
                              <th className="p-4 text-center">Seats</th>
                              <th className="p-4 text-right">Annual Fees</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border font-medium text-foreground">
                            {college.courses?.map((course: Course) => (
                              <tr key={course.id} className="hover:bg-muted/10 transition-colors">
                                <td className="p-4 font-bold">{course.name}</td>
                                <td className="p-4 text-center text-muted-foreground">{course.duration} Years</td>
                                <td className="p-4 text-center text-muted-foreground">{course.seats}</td>
                                <td className="p-4 text-right font-extrabold text-primary">
                                  ₹{course.fees.toLocaleString("en-IN")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* C. Placements Tab */}
                {activeTab === "placements" && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        Historical Placements Trends
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Longitudinal package comparisons over the last three recruitment years, demonstrating student growth metrics.
                      </p>
                    </div>

                    {/* Dynamic Placement Chart Component */}
                    {isMounted && college.placements ? (
                      <PlacementChart data={college.placements} />
                    ) : (
                      <div className="h-[320px] bg-muted/20 animate-pulse rounded-2xl border border-border" />
                    )}

                    {/* Prominent Recruiting Companies */}
                    <div className="flex flex-col gap-3 mt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Recruiting Companies</h3>
                      <div className="flex flex-wrap gap-2">
                        {college.placements?.[0]?.companies.split(",").map((company: string) => (
                          <span
                            key={company}
                            className="px-3.5 py-1.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground shadow-sm flex items-center gap-1.5"
                          >
                            <Building className="w-3.5 h-3.5 text-indigo-500" />
                            {company.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* D. Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="flex flex-col gap-8">
                    {/* Reviews List */}
                    <div className="flex flex-col gap-4">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Student Testimonials ({college.reviews?.length || 0})
                      </h2>

                      <div className="flex flex-col gap-4">
                        {college.reviews?.length === 0 ? (
                          <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-muted/10">
                            <Star className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground font-semibold">No student testimonials yet. Be the first to add yours!</p>
                          </div>
                        ) : (
                          college.reviews?.map((review: Review) => (
                            <div key={review.id} className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  {review.user?.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={review.user.image}
                                      alt={review.user.name || "User"}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                      <Building className="w-4 h-4" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs font-bold text-foreground leading-none">
                                      {review.user?.name || "Student Candidate"}
                                    </p>
                                    <p className="text-[9px] text-muted-foreground leading-none mt-1">
                                      {new Date(review.createdAt).toLocaleDateString("en-IN")}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < review.rating
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-muted-foreground/20"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground italic leading-relaxed pl-1">
                                &ldquo;{review.comment}&rdquo;
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Write Review Form */}
                    <div className="p-6 rounded-2xl border border-border bg-muted/15 flex flex-col gap-4">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Sparkles className="w-4.5 h-4.5 text-primary animate-pulse" />
                        Write an Institution Review
                      </h3>
                      
                      {session ? (
                        <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground">Select Rating:</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setNewRating(star)}
                                  className="text-amber-400 cursor-pointer hover:scale-110 transition-transform"
                                >
                                  <Star className={`w-6 h-6 ${star <= newRating ? "fill-amber-400" : "text-muted-foreground/30"}`} />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your Experience</label>
                            <textarea
                              rows={4}
                              placeholder="Share details of placements, faculties, amenities, or administrative standards..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={reviewLoading}
                            className="self-end flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50"
                          >
                            {reviewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            Post Review
                          </button>
                        </form>
                      ) : (
                        <div className="text-center py-4 bg-card rounded-xl border border-border">
                          <p className="text-xs text-muted-foreground font-semibold mb-3">You must be logged in to submit a student review.</p>
                          <Link href="/auth/signin" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold">
                            Sign In Now
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* E. Facilities Tab */}
                {activeTab === "facilities" && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Building className="w-5 h-5 text-primary" />
                      On-Campus Facilities
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Modern facilities and infrastructural support structures optimized for engineering, healthcare research, or arts programs.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                      {college.facilities.split(",").map((facility: string) => (
                        <div
                          key={facility}
                          className="p-4 border border-border/80 bg-card rounded-2xl flex items-center gap-3 shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-xs font-bold text-foreground truncate">{facility.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Right Column: Sticky Infographics Sheet & CTA Actions */}
        <div className="flex flex-col gap-6">
          {/* Quick Stats Sheet Card */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-6">
            <h3 className="text-sm font-bold text-foreground border-b border-border/40 pb-3 flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-primary" />
              Institutional Statistics
            </h3>

            <div className="flex flex-col gap-4">
              {/* Type */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Sector type:</span>
                <span className="text-foreground uppercase">{college.type}</span>
              </div>
              {/* Established */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Established:</span>
                <span className="text-foreground">{college.established} ({new Date().getFullYear() - college.established} Yrs ago)</span>
              </div>
              {/* Average Fees */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Average Annual Fees:</span>
                <span className="text-foreground font-extrabold">₹{college.averageFees.toLocaleString("en-IN")}</span>
              </div>
              {/* Average Placement */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Average Package:</span>
                <span className="text-emerald-500 font-extrabold">{college.averagePlacement.toFixed(1)} LPA</span>
              </div>
              {/* Highest Placement */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Highest Package:</span>
                <span className="text-primary font-extrabold">{college.highestPlacement.toFixed(1)} LPA</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mt-4 border-t border-border/40 pt-6">
              {/* Compare toggle */}
              <button
                onClick={handleToggleCompare}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                  compared
                    ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/30 shadow-sm"
                    : "bg-card text-foreground border-border hover:bg-muted/40"
                }`}
              >
                <GitCompare className="w-4 h-4" />
                {compared ? "Remove from Comparison" : "Add to Comparison"}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={handleToggleSave}
                disabled={saveLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSaved
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-sm"
                    : "bg-primary text-primary-foreground border-transparent hover:bg-primary/95 shadow-md shadow-primary/10"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-rose-500" : ""}`} />
                {isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
              </button>
            </div>
          </div>

          {/* Quick FAQ / Ad info card */}
          <div className="p-6 rounded-2xl border border-primary/10 bg-primary/5 flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Admissions Assistant
            </span>
            <p className="text-xs font-semibold text-foreground">Need help deciding?</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Add this college to your comparison board to contrast fees, course duration arrays, and placement charts with other target universities.
            </p>
            <Link
              href="/compare"
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 mt-1"
            >
              Open Comparison Board
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}
