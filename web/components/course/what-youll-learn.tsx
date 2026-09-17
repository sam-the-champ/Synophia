import type { ComponentType } from "react";
import {
  Sparkles,
  Code2,
  Workflow,
  Gauge,
  Layers,
  Rocket,
  ShieldCheck,
  Puzzle,
  BadgeCheck,
  Users,
  Infinity as InfinityIcon,
  LifeBuoy,
  Star,
  type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  sparkles: Sparkles,
  code: Code2,
  workflow: Workflow,
  gauge: Gauge,
  layers: Layers,
  rocket: Rocket,
  shield: ShieldCheck,
  puzzle: Puzzle,
  video: Sparkles,
  certificate: BadgeCheck,
  community: Users,
  "lifetime-access": InfinityIcon,
  support: LifeBuoy,
};

function outcomeIcon(icon: string) {
  return ICON_MAP[icon] ?? Star;
}

export function WhatYoullLearn({
  outcomes,
}: {
  outcomes: Array<{ _key: string; icon: string; title: string; description: string }>;
}) {
  if (outcomes.length === 0) return null;

  return (
    <section className="rounded-xl border border-white/10 bg-neutral-800/40 p-6 sm:p-8">
      <h2 className="text-heading-2 font-semibold text-white">What you&apos;ll learn</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {outcomes.map(({ _key, icon, title, description }) => {
          const Icon = outcomeIcon(icon);
          return (
            <div
              key={_key}
              className="flex flex-col gap-4 rounded-lg border border-white/10 bg-neutral-800/60 p-5"
            >
              <div className="grid size-11 place-items-center rounded-full bg-primary-500/15 text-primary-300">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="text-body-lg font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-small text-neutral-400">{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
