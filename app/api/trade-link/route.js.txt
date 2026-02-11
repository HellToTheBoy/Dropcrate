import { NextResponse } from "next/server";

// ⚠️ Replace this with your real DB later
let fakeDatabase: Record<string, string> = {};

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/steamId=([^;]+)/);

  if (!match) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const steamId = match[1];
  const body = await request.json();
  const tradeLink = body.tradeLink;

  if (!tradeLink?.includes("steamcommunity.com/tradeoffer/new")) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // Save trade link to "database"
  fakeDatabase[steamId] = tradeLink;

  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/steamId=([^;]+)/);

  if (!match) {
    return NextResponse.json({ tradeLink: null });
  }

  const steamId = match[1];

  return NextResponse.json({
    tradeLink: fakeDatabase[steamId] || null,
  });
}
