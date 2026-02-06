const recentDrops = [
  {
    username: "ShadowStriker",
    skin: "AK-47 | Redline",
    rarity: "Classified",
    color: "oklch(0.65 0.2 25)",
    timeAgo: "2 min ago",
  },
  {
    username: "NoScopeKing",
    skin: "AWP | Asiimov",
    rarity: "Covert",
    color: "oklch(0.65 0.25 25)",
    timeAgo: "5 min ago",
  },
  {
    username: "FragMaster99",
    skin: "M4A4 | Dragon King",
    rarity: "Restricted",
    color: "oklch(0.6 0.2 280)",
    timeAgo: "8 min ago",
  },
  {
    username: "ClutchGod",
    skin: "USP-S | Kill Confirmed",
    rarity: "Covert",
    color: "oklch(0.65 0.25 25)",
    timeAgo: "12 min ago",
  },
  {
    username: "HeadshotHero",
    skin: "Glock-18 | Fade",
    rarity: "Restricted",
    color: "oklch(0.6 0.2 280)",
    timeAgo: "15 min ago",
  },
  {
    username: "AcePlayer",
    skin: "Butterfly Knife | Vanilla",
    rarity: "Covert",
    color: "oklch(0.65 0.25 25)",
    timeAgo: "18 min ago",
  },
];

export function SkinsSection() {
  return (
    <section id="skins" className="bg-secondary/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Recent Drops
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            See what other players have received.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentDrops.map((drop, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-secondary">
                <div className="text-4xl font-bold text-muted-foreground/20">
                  CS2
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{drop.skin}</h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: drop.color }}
                  >
                    {drop.rarity}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-foreground">{drop.username}</span>
                <span className="text-xs text-muted-foreground">
                  {drop.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
