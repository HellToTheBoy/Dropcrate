export async function GET() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": "steamId=; Path=/; Max-Age=0",
    },
  });
}
