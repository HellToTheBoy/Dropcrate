export async function GET(request) {
  const url = new URL(request.url);
  const claimedId = url.searchParams.get("openid.claimed_id");

  if (!claimedId) {
    return new Response("Steam login failed");
  }

  const steamId = claimedId.split("/").pop();

  const response = Response.redirect("https://dropcrate.online");

  response.headers.append(
    "Set-Cookie",
    `steamId=${steamId}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  return response;
}
