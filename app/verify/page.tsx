"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ExternalLink, Gift, Link, Clock, Package } from "lucide-react";

const simulateComplete = (step: number) => {
  // Simulate offer completion for demonstration purposes
  if (step === 1) {
    window.postMessage({ type: "offer_complete", step: 1 }, "*");
  }
  if (step === 2) {
    window.postMessage({ type: "offer_complete", step: 2 }, "*");
  }
};

export default function VerifyPage() {
  const router = useRouter();
  const [tradeLink, setTradeLink] = useState("");
  const [user, setUser] = useState<{
  steamId: string;
  username?: string;
  avatar?: string;
} | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tradeLinkSaved, setTradeLinkSaved] = useState(false);
  const [step1Complete, setStep1Complete] = useState(false);
  const [step2Complete, setStep2Complete] = useState(false);
  const [showOfferWall, setShowOfferWall] = useState<1 | 2 | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryAvailable, setInventoryAvailable] = useState(true);
  const [inventoryCount, setInventoryCount] = useState<number>(0);

  const isValidTradeLink = tradeLink.includes("steamcommunity.com/tradeoffer/new");
  const allComplete = tradeLinkSaved && step1Complete && step2Complete;
  const isOnCooldown = cooldownRemaining !== null && cooldownRemaining > 0;

  useEffect(() => {
  const loadTradeLink = async () => {
    const res = await fetch("/api/trade-link");
    const data = await res.json();

    if (data.tradeLink) {
      setTradeLink(data.tradeLink);
      setTradeLinkSaved(true);
    }
  };

  loadTradeLink();
}, []);

  // 🔐 Check if user is logged in
  useEffect(() => {
  fetch("/api/me")
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        window.location.href = "/api/auth/steam";
      } else {
        setUser(data);
      }
    });
}, []);
  
  // 🔄 Poll offer completion
useEffect(() => {
  if (!user) return;

  const interval = setInterval(async () => {
    const res = await fetch("/api/offer-status");
    const data = await res.json();

    if (data.completed) {
      setStep1Complete(true);
      setStep2Complete(true);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [user]);

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
        // If API fails, allow claim
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

  // Handle postback callback from offer wall - in production this would be handled server-side
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle offer completion postback messages
      if (event.data?.type === "offer_complete") {
        if (event.data.step === 1) setStep1Complete(true);
        if (event.data.step === 2) setStep2Complete(true);
        setShowOfferWall(null);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const openOfferWall = () => {
  if (!user) return;

  const offerUrl = `https://lockedapp.space/sl/319nw?aff_sub=${user.steamId}`;

  window.open(offerUrl, "_blank");
};

  const handleClaim = () => {
    router.push("/reward");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-xl flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Checking eligibility...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!inventoryAvailable) {
    return (
      <main className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-xl">
          <div className="text-center py-16">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <Package className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="mb-3 text-2xl font-bold text-foreground">
              Out of Stock
            </h1>
            <p className="mb-4 text-muted-foreground">
              We currently have less than 30 skins in our inventory.
            </p>
            <p className="mb-8 text-sm text-muted-foreground">
              Current inventory: {inventoryCount} skins
            </p>
            <div>
              <Button variant="outline" className="bg-transparent" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isOnCooldown && cooldownRemaining) {
    return (
      <main className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-xl">
          <div className="text-center py-16">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <Clock className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="mb-3 text-2xl font-bold text-foreground">
              Cooldown Active
            </h1>
            <p className="mb-8 text-muted-foreground">
              You can claim another skin in:
            </p>
            <div className="mb-8 inline-block rounded-2xl border border-border bg-card px-8 py-6">
              <div className="text-4xl font-bold tabular-nums text-foreground">
                {formatTimeRemaining(cooldownRemaining)}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                hours : minutes : seconds
              </p>
            </div>
            <div>
              <Button variant="outline" className="bg-transparent" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

 return (
  <main className="min-h-screen bg-background px-6 py-12">
    <div className="mx-auto max-w-xl">

      {user && (
  <div className="mb-8 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
    
    <img
      src={user.avatar}
      alt="Steam Avatar"
      className="h-12 w-12 rounded-full"
    />

    <div>
      <p className="font-medium text-foreground">
        {user.username}
      </p>
      <p className="text-sm text-muted-foreground">
        Logged in via Steam
      </p>
    </div>
  </div>
)}
      
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">
              {(tradeLinkSaved ? 1 : 0) + (step1Complete ? 1 : 0) + (step2Complete ? 1 : 0)} / 3 completed
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${((tradeLinkSaved ? 1 : 0) + (step1Complete ? 1 : 0) + (step2Complete ? 1 : 0)) * 33.33}%`,
              }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {/* Step 0 - Trade Link */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  tradeLinkSaved
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-border bg-secondary"
                }`}
              >
                {tradeLinkSaved ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Link className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-foreground">
                  Enter Trade Link
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  We need your Steam trade link to send you the skin.
                </p>
                {!tradeLinkSaved ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                      value={tradeLink}
                      onChange={(e) => setTradeLink(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={async () => {
  const res = await fetch("/api/trade-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tradeLink }),
  });

  const data = await res.json();

  if (data.success) {
    setTradeLinkSaved(true);
  }
}}
                        
                        disabled={!isValidTradeLink}
                        className="gap-2"
                      >
                        Save Trade Link
                      </Button>
                      <a
                        href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Find your trade link
                      </a>
                    </div>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <Check className="h-4 w-4" />
                    Trade link saved
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 1 - Offer */}
          <div
            className={`rounded-xl border bg-card p-6 ${
              tradeLinkSaved ? "border-border" : "border-border/50 opacity-60"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  step1Complete
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-border bg-secondary"
                }`}
              >
                {step1Complete ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground">
                    1
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-foreground">
                  Complete Offer
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Complete one offer from our partners to continue.
                </p>
                {!step1Complete ? (
                  showOfferWall === 1 ? (
                    <div className="space-y-3">
                      <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                        <p className="mb-3 text-sm text-muted-foreground">
                          Complete an offer to continue
                        </p>
                        <Button
                          size="sm"
                          onClick={() => simulateComplete(1)}
                          className="gap-2"
                        >
                          Complete Offer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => openOfferWall(1)}
                      disabled={!tradeLinkSaved}
                      variant={tradeLinkSaved ? "default" : "secondary"}
                      className="gap-2"
                    >
                      View Offers
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <Check className="h-4 w-4" />
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 2 - Offer */}
          <div
            className={`rounded-xl border bg-card p-6 ${
              step1Complete ? "border-border" : "border-border/50 opacity-60"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  step2Complete
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-border bg-secondary"
                }`}
              >
                {step2Complete ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground">
                    2
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-foreground">
                  Complete Second Offer
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  One more offer to unlock your reward.
                </p>
                {!step2Complete ? (
                  showOfferWall === 2 ? (
                    <div className="space-y-3">
                      <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                        <p className="mb-3 text-sm text-muted-foreground">
                          Complete an offer to continue
                        </p>
                        <Button
                          size="sm"
                          onClick={() => simulateComplete(2)}
                          className="gap-2"
                        >
                          Complete Offer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => openOfferWall(2)}
                      disabled={!step1Complete}
                      variant={step1Complete ? "default" : "secondary"}
                      className="gap-2"
                    >
                      View Offers
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <Check className="h-4 w-4" />
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Claim Button */}
        <div className="mt-8">
          <Button
            size="lg"
            className="w-full gap-2 text-base"
            disabled={!allComplete}
            onClick={handleClaim}
          >
            <Gift className="h-5 w-5" />
            {allComplete ? "Claim Your Skin" : "Complete Steps to Claim"}
          </Button>
          {!allComplete && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Complete both offers above to unlock your random CS2 skin
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
