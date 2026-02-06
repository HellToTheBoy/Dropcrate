export async function GET() {
  return Response.json({
    status: "ok",
    message: "Backend is alive",
  });
}

