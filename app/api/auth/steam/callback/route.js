export async function GET(request) {
  const url = new URL(request.url);
  const claimedId = url.searchParams.get("openid.claimed_id");

  if (!claimedId) {
    return new Response("Steam login failed");
  }

  const steamId = claimedId.split("/").pop();

  return new Response(null, {
    status: 302,
    headers: {
      Location: "https://dropcrate.online",
      "Set-Cookie": `steamId=${steamId}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
