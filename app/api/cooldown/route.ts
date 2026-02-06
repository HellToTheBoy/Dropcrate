import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOLDOWN_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// In-memory store for IP-based cooldowns (in production, use a database like Redis)
const cooldownStore = new Map<string, number>();

function getClientIP(request: NextRequest): string {
  // Try various headers for IP detection
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfIP = request.headers.get("cf-connecting-ip");
  
  if (cfIP) return cfIP;
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  
  return "unknown";
}

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const cookieStore = await cookies();
  const claimCookie = cookieStore.get("last_claim");
  
  // Check both cookie and IP-based cooldown
  let lastClaimTime = 0;
  
  // Check cookie first
  if (claimCookie) {
    lastClaimTime = parseInt(claimCookie.value, 10);
  }
  
  // Also check IP store
  const ipLastClaim = cooldownStore.get(ip);
  if (ipLastClaim && ipLastClaim > lastClaimTime) {
    lastClaimTime = ipLastClaim;
  }
  
  const now = Date.now();
  const timeRemaining = lastClaimTime + COOLDOWN_DURATION - now;
  
  if (timeRemaining > 0) {
    return NextResponse.json({
      canClaim: false,
      timeRemaining,
      nextClaimAt: lastClaimTime + COOLDOWN_DURATION,
    });
  }
  
  return NextResponse.json({
    canClaim: true,
    timeRemaining: 0,
    nextClaimAt: null,
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const now = Date.now();
  
  // Check existing cooldown
  const cookieStore = await cookies();
  const claimCookie = cookieStore.get("last_claim");
  let lastClaimTime = 0;
  
  if (claimCookie) {
    lastClaimTime = parseInt(claimCookie.value, 10);
  }
  
  const ipLastClaim = cooldownStore.get(ip);
  if (ipLastClaim && ipLastClaim > lastClaimTime) {
    lastClaimTime = ipLastClaim;
  }
  
  const timeRemaining = lastClaimTime + COOLDOWN_DURATION - now;
  
  if (timeRemaining > 0) {
    return NextResponse.json({
      success: false,
      message: "You must wait before claiming again",
      timeRemaining,
    }, { status: 429 });
  }
  
  // Record the claim
  cooldownStore.set(ip, now);
  
  // Set cookie for additional tracking
  const response = NextResponse.json({
    success: true,
    message: "Claim recorded",
    nextClaimAt: now + COOLDOWN_DURATION,
  });
  
  response.cookies.set("last_claim", now.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOLDOWN_DURATION / 1000, // Convert to seconds
  });
  
  return response;
}
