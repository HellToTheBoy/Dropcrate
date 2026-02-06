"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Clock, Package } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryCount, setInventoryCount] = useState<number>(0);
  const [inventoryAvailable, setInventoryAvailable] = useState(true);

  const isOnCooldown = cooldownRemaining !== null && cooldownRemaining > 0;

  // Check cooldown and inventory status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [cooldownRes, inventoryRes] = await Promise.all([
          fetch("/api/cooldown"),
          fetch("/api/inventory"),
        ]);
        
        const cooldownData = await cooldownRes.json();
        const inventoryData = await inventoryRes.json();
        
        if (!cooldownData.canClaim) {
          setCooldownRemaining(cooldownData.timeRemaining);
        }
        
        setInventoryCount(inventoryData.count);
        setInventoryAvailable(inventoryData.available);
      } catch {
        // If API fails, allow access
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isOnCooldown) return;

    const interval = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev === null || prev <= 1000) {
          return null;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOnCooldown]);

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
          Unlock Free CS2 Skins
        </h1>

        <p className="mx-auto mb-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          Complete two simple verification steps and unlock a random skin from
          our collection. New skins added daily.
        </p>

        {/* Inventory Counter */}
        {!isLoading && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {inventoryCount} skins available
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="inline-flex items-center gap-2 px-8 py-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-muted-foreground">Checking status...</span>
          </div>
        ) : !inventoryAvailable ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-4">
              <Package className="h-6 w-6 text-destructive" />
              <div className="text-left">
                <p className="font-semibold text-foreground">Out of Stock</p>
                <p className="text-sm text-muted-foreground">
                  Check back later for more skins
                </p>
              </div>
            </div>
          </div>
        ) : isOnCooldown && cooldownRemaining ? (
          <div className="space-y-4">
            <div className="inline-block rounded-2xl border border-border bg-card px-8 py-6">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Next claim available in
                </span>
              </div>
              <div className="text-4xl font-bold tabular-nums text-foreground">
                {formatTimeRemaining(cooldownRemaining)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                hours : minutes : seconds
              </p>
            </div>
          </div>
        ) : (
          <Button size="lg" className="gap-2 px-8 text-base font-medium" asChild>
            <Link href="/verify">
              <Gift className="h-5 w-5" />
              Claim Skin
            </Link>
          </Button>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex animate-bounce flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs">Scroll to learn more</span>
          <div className="h-6 w-4 rounded-full border-2 border-muted-foreground">
            <div className="mx-auto mt-1 h-1.5 w-1 rounded-full bg-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}
