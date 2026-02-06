"use client";

import { CheckCircle2, UserCheck, Gift } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserCheck,
    title: "Complete Verification",
    description:
      "Verify you're human by completing a quick task. This helps us prevent bots and ensures fair distribution.",
  },
  {
    number: "02",
    icon: CheckCircle2,
    title: "Confirm Identity",
    description:
      "Complete a second verification step to confirm your eligibility. This only takes a few seconds.",
  },
  {
    number: "03",
    icon: Gift,
    title: "Unlock Your Skin",
    description:
      "Once verified, you'll instantly unlock a random CS2 skin from our collection. Check your inventory!",
  },
];

export function StepsSection() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Three simple steps to unlock your free CS2 skin
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/50"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  {step.number}
                </span>
                {index < steps.length - 1 && (
                  <div className="hidden h-px w-full bg-border md:block" />
                )}
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
