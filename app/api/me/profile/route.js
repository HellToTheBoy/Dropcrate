export async function GET(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/steamId=([^;]+)/);

  if (!match) {
    return Response.json({ loggedIn: false });
  }

  const steamId = match[1];
  const apiKey = process.env.STEAM_API_KEY;

  const res = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
  );

  const data = await res.json();
  const player = data.response.players[0];

  return Response.json({
    loggedIn: true,
    username: player.personaname,
  });
}
