// ⚠️ Temporary in-memory storage (replace with DB later)
let offerDatabase = {};
let completedTransactions = new Set();

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get("aff_sub");
  const payout = searchParams.get("payout");
  const txid = searchParams.get("txid");
  const secret = searchParams.get("secret");

  // 🔐 Validate secret
  if (secret !== process.env.OGADS_SECRET) {
    return new Response("Invalid Secret", { status: 403 });
  }

  // 🔐 Prevent duplicate transaction
  if (completedTransactions.has(txid)) {
    return new Response("Duplicate", { status: 200 });
  }

  completedTransactions.add(txid);

  if (!offerDatabase[userId]) {
    offerDatabase[userId] = {
      earnings: 0,
      completed: false,
    };
  }

  offerDatabase[userId].earnings += parseFloat(payout);

  // Example rule: unlock after $1 earned
  if (offerDatabase[userId].earnings >= 1) {
    offerDatabase[userId].completed = true;
  }

  return new Response("OK");
}
