export async function GET() {
  const steamOpenIdUrl =
    "https://steamcommunity.com/openid/login" +
    "?openid.ns=http://specs.openid.net/auth/2.0" +
    "&openid.mode=checkid_setup" +
    "&openid.return_to=https://dropcrate.online/api/auth/steam/callback" +
    "&openid.realm=https://dropcrate.online" +
    "&openid.identity=http://specs.openid.net/auth/2.0/identifier_select" +
    "&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select";

  return Response.redirect(steamOpenIdUrl);
}
