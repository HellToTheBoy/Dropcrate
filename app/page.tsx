"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.loggedIn ? data : null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>DropCrate</h1>
        <a href="/api/auth/steam">
          <button>Sign in with Steam</button>
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome to DropCrate</h1>
      <p>Logged in as:</p>
      <code>{user.steamId}</code>

      <br /><br />

      <a href="/api/logout">
        <button>Logout</button>
      </a>
    </div>
  );
}
