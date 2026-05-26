"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Search,
  Bookmark,
  GitCompare,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  User,
  ChevronDown,
} from "lucide-react";
import { useComparisonStore } from "@/store/comparisonStore";
import CommandPalette from "./command-palette";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { selectedColleges } = useComparisonStore();

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      return savedTheme || preferredTheme;
    }
    return "light";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Synchronize and load theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { name: "Explore", href: "/", icon: Search },
    { name: "Compare", href: "/compare", icon: GitCompare, badge: selectedColleges.length },
    { name: "Wishlist", href: "/wishlist", icon: Bookmark, protected: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] w-full glass-navbar border-b border-white/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-glow-primary">
              <Compass className="w-6 h-6 animate-pulse-slow" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent">
              CampusCompass<span className="text-primary font-extrabold text-sm ml-0.5 tracking-normal">AI</span>
            </span>
          </Link>

          {/* Search Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:border-primary/20 transition-all duration-200 cursor-pointer w-full max-w-sm"
          >
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-left flex-1">Search colleges, courses...</span>
            <kbd className="text-xs font-semibold px-2 py-0.5 rounded border border-border bg-muted/80 text-muted-foreground flex-shrink-0">
              Ctrl K
            </kbd>
          </button>

          {/* Desktop Links & Controls */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              if (link.protected && !session) return null;
              const LinkIcon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 text-sm font-medium px-1.5 py-1 rounded-lg transition-colors duration-200 hover:text-primary ${
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  {link.name}
                  {link.badge ? (
                    <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                      {link.badge}
                    </span>
                  ) : null}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Vertical Separator */}
            <div className="w-[1px] h-6 bg-border" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:border-primary/20 transition-all duration-200 cursor-pointer"
              title="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* User Account / Auth Trigger */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name || "Avatar"}
                      className="w-7 h-7 rounded-full object-cover border border-primary/20"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="text-xs font-semibold max-w-[80px] truncate">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-1 shadow-lg z-20"
                      >
                        <div className="px-3 py-2 border-b border-border mb-1">
                          <p className="text-xs font-semibold truncate text-foreground">
                            {session.user.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {session.user.email}
                          </p>
                        </div>

                        <Link
                          href="/wishlist"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                        >
                          <Bookmark className="w-4 h-4" />
                          My Wishlist
                        </Link>

                        <Link
                          href="/compare"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                        >
                          <GitCompare className="w-4 h-4" />
                          Compare Board
                        </Link>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/95 shadow-md shadow-primary/20 rounded-xl transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Navigation Trigger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all duration-200"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl border border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3 shadow-inner"
            >
              {/* Search Trigger inside Mobile Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCommandPaletteOpen(true);
                }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 transition-all duration-200 cursor-pointer w-full text-left"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Search colleges, courses...</span>
              </button>

              {navLinks.map((link) => {
                if (link.protected && !session) return null;
                const LinkIcon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LinkIcon className="w-4 h-4" />
                      {link.name}
                    </div>
                    {link.badge ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}

              {session ? (
                <>
                  <div className="h-[1px] bg-border my-1" />
                  <div className="px-3 py-1 flex items-center gap-3">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name || "Avatar"}
                        className="w-8 h-8 rounded-full object-cover border border-primary/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-foreground">{session.user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{session.user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="h-[1px] bg-border my-1" />
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/95 shadow-md rounded-xl transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Real-time search Modal (Command Palette) */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <CommandPalette onClose={() => setCommandPaletteOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
