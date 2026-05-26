import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ToastContainer from "@/components/toast-container";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusCompass AI | Intelligent College Discovery & Comparison",
  description:
    "An advanced AI-powered college search and comparison platform tailored for Indian students. Explore placements, course streams, annual fees, ratings, and student reviews for 50+ top universities in India.",
  keywords: [
    "CampusCompass",
    "College Discovery India",
    "Compare Engineering Colleges",
    "Best MBA Colleges India",
    "AI College Recommendation",
    "Indian Universities Placements",
    "IIT BITS NIT admission",
  ],
  authors: [{ name: "CampusCompass Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
