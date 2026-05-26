"use client";

import React from "react";
import Link from "next/link";
import { Compass, Globe, Link as LinkIcon, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                CampusCompass<span className="text-primary font-bold">AI</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              CampusCompass AI is an intelligent discovery and comparison platform engineered to help Indian students navigate through high-quality college rankings, fees, course selections, and placements.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground mt-2">
              <a href="#" className="hover:text-primary transition-colors" title="Social Website"><Globe className="w-4 h-4" /></a>
              <a href="#" className="hover:text-primary transition-colors" title="External Links"><LinkIcon className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Discovery</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/?stream=Engineering" className="text-xs text-muted-foreground hover:text-primary transition-colors">Engineering Colleges</Link>
              </li>
              <li>
                <Link href="/?stream=Management" className="text-xs text-muted-foreground hover:text-primary transition-colors">Business Schools</Link>
              </li>
              <li>
                <Link href="/?stream=Medical" className="text-xs text-muted-foreground hover:text-primary transition-colors">Medical Institutions</Link>
              </li>
              <li>
                <Link href="/compare" className="text-xs text-muted-foreground hover:text-primary transition-colors">Side-by-Side Compare</Link>
              </li>
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Internship Portal</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <span className="text-xs text-muted-foreground">Version 1.2.0 (Stable)</span>
              </li>
              <li>
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact Support</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Banner */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground font-semibold">
            © {new Date().getFullYear()} CampusCompass AI. All rights reserved. Developed for Indian Students.
          </p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> for Technical Assignment.
          </p>
        </div>
      </div>
    </footer>
  );
}
