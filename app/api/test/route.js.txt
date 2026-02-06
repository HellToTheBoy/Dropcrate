export async function GET(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/steamId=([^;]+)/);

  return Response.json({
    loggedIn: !!match,
    steamId: match ? match[1] : null,
  });
}
