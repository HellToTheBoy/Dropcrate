export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/steamId=([^;]+)/);

  if (!match) {
    return Response.json({ loggedIn: false });
  }

  const steamId = match[1];

  return Response.json({
    loggedIn: true,
    steamId,
    username: `SteamUser_${steamId.slice(-4)}`, // temporary until you fetch real Steam profile
  });
}
