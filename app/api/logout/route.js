export async function GET() {
  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": "steamId=; Path=/; Max-Age=0",
      Location: "/",
    },
  });
}
