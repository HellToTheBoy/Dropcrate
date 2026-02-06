export async function GET(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/steamId=([^;]+)/);

  if (!match) {
    return Response.json({ loggedIn: false });
  }

  return Response.json({
    loggedIn: true,
    steamId: match[1],
  });
}
