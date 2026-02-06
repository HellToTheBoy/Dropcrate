import { NextResponse } from "next/server";

// Minimum skins required to allow claims
const MIN_SKINS_REQUIRED = 30;

// In-memory store for inventory count (in production, use a database)
// This should be managed by an admin panel in a real application
let inventoryCount = 150; // Starting inventory

export async function GET() {
  return NextResponse.json({
    available: inventoryCount >= MIN_SKINS_REQUIRED,
    count: inventoryCount,
    minRequired: MIN_SKINS_REQUIRED,
  });
}

// POST to decrement inventory (called when skin is claimed)
export async function POST() {
  if (inventoryCount > 0) {
    inventoryCount -= 1;
  }
  
  return NextResponse.json({
    available: inventoryCount >= MIN_SKINS_REQUIRED,
    count: inventoryCount,
    minRequired: MIN_SKINS_REQUIRED,
  });
}
