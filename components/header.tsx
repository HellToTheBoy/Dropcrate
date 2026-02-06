"use client";

import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            DropCrate
          </span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </a>
          <a
            href="#skins"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Skins
          </a>
          <a
            href="#faq"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </a>
        </nav>
        <Button size="sm" className="gap-2 font-medium">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2a10 10 0 0 0-3.16 19.5l4.58-6.33a2.5 2.5 0 1 1 3.33-3.22l5.19-1.87A10 10 0 0 0 12 2zm0 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
          </svg>
          Login with Steam
        </Button>
      </div>
    </header>
  );
}
