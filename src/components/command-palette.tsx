"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Compass, GitCompare, Bookmark, Moon, Sun, ArrowRight, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface CommandPaletteProps {
  onClose: () => void;
}

interface SuggestionItem {
  id: string;
  name: string;
  location: string;
  state: string;
  stream: string;
}

export default function CommandPalette({ onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch quick suggestions as the user types
  useEffect(() => {
    if (query.trim().length < 2) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`);
        const result = await res.json();
        if (result.success) {
          setSuggestions(result.data);
        }
      } catch (err) {
        console.error("Autocomplete search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 150); // Small debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard navigation inside the suggestions box
  const totalItems = suggestions.length + 3 + (session ? 1 : 1); // suggestions + static actions

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === "Enter") {
      e.preventDefault();
      triggerAction(activeIndex);
    }
  };

  const triggerAction = (index: number) => {
    // 1. Suggestions list
    if (index < suggestions.length) {
      const selected = suggestions[index];
      router.push(`/college/${selected.id}`);
      onClose();
      return;
    }

    // 2. Static quick actions
    const actionIndex = index - suggestions.length;
    switch (actionIndex) {
      case 0:
        router.push("/compare");
        onClose();
        break;
      case 1:
        if (session) {
          router.push("/wishlist");
        } else {
          router.push("/auth/signin");
        }
        onClose();
        break;
      case 2:
        // Toggle theme action
        const currentTheme = localStorage.getItem("theme") || "light";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        window.location.reload(); // Quick refresh to sync theme
        onClose();
        break;
      case 3:
        if (session) {
          router.push("/wishlist");
        } else {
          router.push("/auth/signin");
        }
        onClose();
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Main command modal box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg rounded-2xl border border-white/10 glass-card bg-card overflow-hidden z-[210] shadow-2xl flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/10">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type 'iit' or search location, streams..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-sm py-1"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />}
        </div>

        {/* Results scroll pane */}
        <div ref={scrollRef} className="max-h-[350px] overflow-y-auto p-2 flex flex-col gap-1">
          {/* Dynamic suggestion headers */}
          {suggestions.length > 0 && (
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Colleges Found
            </div>
          )}

          {/* Autocomplete items */}
          {suggestions.map((item, idx) => {
            const isFocused = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => {
                  router.push(`/college/${item.id}`);
                  onClose();
                }}
                className={`w-full flex items-center justify-between text-left p-3 rounded-xl transition-all duration-150 ${
                  isFocused
                    ? "bg-primary text-primary-foreground shadow-glow-primary scale-[1.01]"
                    : "hover:bg-muted/40 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Compass className={`w-4 h-4 flex-shrink-0 ${isFocused ? "text-primary-foreground" : "text-primary"}`} />
                  <div>
                    <p className="text-xs font-semibold line-clamp-1">{item.name}</p>
                    <p className={`text-[10px] ${isFocused ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {item.location}, {item.state} • {item.stream}
                    </p>
                  </div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 opacity-0 ${isFocused ? "opacity-100" : ""}`} />
              </button>
            );
          })}

          {/* Empty Results state */}
          {query.trim().length >= 2 && suggestions.length === 0 && !loading && (
            <div className="py-8 text-center">
              <Compass className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2 animate-bounce" />
              <p className="text-xs text-muted-foreground font-medium">No Indian colleges found matching your search</p>
            </div>
          )}

          {/* Categories title for Quick Actions */}
          <div className="px-3 py-1.5 mt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-t border-border/40 pt-3">
            Quick Actions & Navigation
          </div>

          {/* Action 1: Compare Board */}
          <button
            onClick={() => {
              router.push("/compare");
              onClose();
            }}
            className={`w-full flex items-center justify-between text-left p-3 rounded-xl transition-all duration-150 ${
              activeIndex === suggestions.length
                ? "bg-primary text-primary-foreground shadow-glow-primary scale-[1.01]"
                : "hover:bg-muted/40 text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <GitCompare className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold">Compare colleges side-by-side</p>
                <p className="text-[10px] opacity-80">Open comparison dashboard board</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />
          </button>

          {/* Action 2: Wishlist */}
          <button
            onClick={() => {
              if (session) router.push("/wishlist");
              else router.push("/auth/signin");
              onClose();
            }}
            className={`w-full flex items-center justify-between text-left p-3 rounded-xl transition-all duration-150 ${
              activeIndex === suggestions.length + 1
                ? "bg-primary text-primary-foreground shadow-glow-primary scale-[1.01]"
                : "hover:bg-muted/40 text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold">View my saved colleges</p>
                <p className="text-[10px] opacity-80">Open wishlist board</p>
              </div>
            </div>
          </button>

          {/* Action 3: Toggle Theme */}
          <button
            onClick={() => {
              const currentTheme = localStorage.getItem("theme") || "light";
              const newTheme = currentTheme === "light" ? "dark" : "light";
              localStorage.setItem("theme", newTheme);
              document.documentElement.classList.toggle("dark", newTheme === "dark");
              window.location.reload();
              onClose();
            }}
            className={`w-full flex items-center justify-between text-left p-3 rounded-xl transition-all duration-150 ${
              activeIndex === suggestions.length + 2
                ? "bg-primary text-primary-foreground shadow-glow-primary scale-[1.01]"
                : "hover:bg-muted/40 text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4 text-amber-500 dark:hidden flex-shrink-0" />
              <Moon className="w-4 h-4 text-sky-400 hidden dark:block flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold">Toggle Color Theme</p>
                <p className="text-[10px] opacity-80">Switch color modes</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-muted/30 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <div>CampusCompass AI</div>
        </div>
      </motion.div>
    </div>
  );
}
