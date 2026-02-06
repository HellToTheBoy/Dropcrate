"use client";

import { useCallback, useRef } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gift, ArrowRight, Check, Copy } from "lucide-react";

// Skin pool with weighted ratios (higher weight = more common)
const skinPool = [
  // Common skins (70% chance total)
  { name: "P250 | Sand Dune", rarity: "Consumer", color: "#b0c3d9", weight: 25 },
  { name: "MP7 | Army Recon", rarity: "Consumer", color: "#b0c3d9", weight: 20 },
  { name: "SCAR-20 | Sand Mesh", rarity: "Consumer", color: "#b0c3d9", weight: 15 },
  { name: "MAC-10 | Silver", rarity: "Consumer", color: "#b0c3d9", weight: 10 },
  
  // Uncommon skins (20% chance total)
  { name: "AK-47 | Safari Mesh", rarity: "Industrial", color: "#5e98d9", weight: 8 },
  { name: "M4A1-S | Boreal Forest", rarity: "Industrial", color: "#5e98d9", weight: 7 },
  { name: "AWP | Safari Mesh", rarity: "Industrial", color: "#5e98d9", weight: 5 },
  
  // Rare skins (8% chance total)
  { name: "AK-47 | Redline", rarity: "Classified", color: "#d32ce6", weight: 4 },
  { name: "USP-S | Cortex", rarity: "Restricted", color: "#8847ff", weight: 4 },
  
  // Very rare skins (2% chance total)
  { name: "AWP | Asiimov", rarity: "Covert", color: "#eb4b4b", weight: 1.5 },
  { name: "M4A4 | Howl", rarity: "Contraband", color: "#e4ae39", weight: 0.5 },
];

function getRandomSkin() {
  const totalWeight = skinPool.reduce((sum, skin) => sum + skin.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const skin of skinPool) {
    random -= skin.weight;
    if (random <= 0) return skin;
  }
  return skinPool[0];
}

export default function RewardPage() {
  const [countdown, setCountdown] = useState(5);
  const [isSpinning, setIsSpinning] = useState(true);
  const [selectedSkin, setSelectedSkin] = useState<(typeof skinPool)[0] | null>(
    null
  );
  const [displaySkin, setDisplaySkin] = useState(skinPool[0]);
  const [copied, setCopied] = useState(false);
  const hasRecordedClaim = useRef(false);

  // Spinning animation through skins
  useEffect(() => {
    if (!isSpinning) return;

    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * skinPool.length);
      setDisplaySkin(skinPool[randomIndex]);
    }, 100);

    return () => clearInterval(spinInterval);
  }, [isSpinning]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setIsSpinning(false);
      setSelectedSkin(getRandomSkin());

      // Record the claim for cooldown and decrement inventory
      if (!hasRecordedClaim.current) {
        hasRecordedClaim.current = true;
        Promise.all([
          fetch("/api/cooldown", { method: "POST" }),
          fetch("/api/inventory", { method: "POST" }),
        ]).catch(() => {
          // Silent fail - cooldown will still be tracked by cookie
        });
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const copyTradeLink = useCallback(() => {
    navigator.clipboard.writeText("https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=abcdef");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const currentSkin = selectedSkin || displaySkin;

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-lg text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            {isSpinning ? "Selecting Your Skin..." : "Congratulations!"}
          </h1>
          <p className="text-muted-foreground">
            {isSpinning
              ? "Please wait while we select your random skin"
              : "You've unlocked a CS2 skin!"}
          </p>
        </div>

        {/* Countdown / Skin Display */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card">
          {/* Skin Preview */}
          <div
            className="relative flex h-48 items-center justify-center transition-colors duration-100"
            style={{ backgroundColor: `${currentSkin.color}20` }}
          >
            {isSpinning && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <div className="mb-2 text-5xl font-bold text-primary">
                    {countdown}
                  </div>
                  <p className="text-sm text-muted-foreground">seconds remaining</p>
                </div>
              </div>
            )}
            <div className="text-6xl font-bold text-muted-foreground/20">CS2</div>
          </div>

          {/* Skin Info */}
          <div className="border-t border-border p-6">
            <div
              className={`transition-opacity duration-300 ${isSpinning ? "opacity-50" : "opacity-100"}`}
            >
              <h2 className="mb-1 text-xl font-semibold text-foreground">
                {currentSkin.name}
              </h2>
              <p className="font-medium" style={{ color: currentSkin.color }}>
                {currentSkin.rarity}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isSpinning && selectedSkin && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 text-sm text-muted-foreground">
                A trade offer will be sent to your Steam account within 24 hours.
                Make sure your inventory is public.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-secondary px-3 py-2 text-xs text-muted-foreground">
                  steamcommunity.com/tradeoffer/...
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyTradeLink}
                  className="shrink-0 gap-2 bg-transparent"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Button size="lg" className="w-full gap-2" asChild>
              <a href="/">
                Back to Home
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>

            <p className="text-xs text-muted-foreground">
              Trade offers are processed automatically. Contact support if you
              don't receive your skin within 24 hours.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
