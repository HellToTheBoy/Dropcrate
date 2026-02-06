export async function GET(request) {
  const url = new URL(request.url);
  const claimedId = url.searchParams.get("openid.claimed_id");

  if (!claimedId) {
    return new Response("Steam login failed");
  }

  const steamId = claimedId.split("/").pop();

  // Create a response
  const response = Response.redirect("https://dropcrate.online");

  // Set cookie (session)
  response.headers.set(
    "Set-Cookie",
    `steamId=${steamId}; Path=/; HttpOnly; SameSite=Lax`
  );

  return response;
}
