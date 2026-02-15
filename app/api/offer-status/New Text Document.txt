let offerDatabase = {};

export async function GET(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/steamId=([^;]+)/);

  if (!match) {
    return Response.json({ completed: false });
  }

  const steamId = match[1];

  return Response.json(
    offerDatabase[steamId] || { completed: false }
  );
}
