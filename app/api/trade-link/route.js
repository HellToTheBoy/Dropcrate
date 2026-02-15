// Temporary memory storage (will reset on deploy)
let fakeDatabase = {};

export async function POST(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/steamId=([^;]+)/);

  if (!match) {
    return Response.json({ success: false });
  }

  const steamId = match[1];
  const body = await request.json();

  fakeDatabase[steamId] = body.tradeLink;

  return Response.json({ success: true });
}

export async function GET(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/steamId=([^;]+)/);

  if (!match) {
    return Response.json({ tradeLink: null });
  }

  const steamId = match[1];

  return Response.json({
    tradeLink: fakeDatabase[steamId] || null,
  });
}
