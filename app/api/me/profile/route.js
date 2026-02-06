export async function GET(request) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/steamId=([^;]+)/);

    if (!match) {
      return Response.json({ loggedIn: false });
    }

    const steamId = match[1];
    const apiKey = process.env.STEAM_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "STEAM_API_KEY missing" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
    );

    const data = await res.json();

    if (!data.response.players.length) {
      return Response.json(
        { error: "Steam user not found" },
        { status: 500 }
      );
    }

    const player = data.response.players[0];

    return Response.json({
      loggedIn: true,
      username: player.personaname,
    });
  } catch (err) {
    return Response.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
