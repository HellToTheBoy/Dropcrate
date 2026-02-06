"use client";

import { useEffect, useState } from "react";

import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { StepsSection } from "@/components/steps-section";
import { SkinsSection } from "@/components/skins-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

type User = {
  loggedIn: boolean;
  steamId: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.loggedIn ? data : null);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* AUTH BAR */}
      <div className="flex justify-end items-center px-6 py-3 border-b border-border text-sm">
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="opacity-80">
              Logged in
            </span>
            <a
              href="/api/logout"
              className="underline hover:opacity-80"
            >
              Logout
            </a>
          </div>
        ) : (
          <a
            href="/api/auth/steam"
            className="underline hover:opacity-80"
          >
            Sign in with Steam
          </a>
        )}
      </div>

      {/* ORIGINAL UI */}
      <Header />
      <HeroSection />
      <StepsSection />
      <SkinsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
