import type { ReactNode } from "react";
import { Play, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "video" | "lesson" | "popular";

const config: Record<Variant, { label: string; icon: ReactNode; className: string }> = {
  video: {
    label: "VIDEO",
    icon: <Play className="size-3 fill-current" />,
    className: "bg-primary-600/20 text-primary-300",
  },
  lesson: {
    label: "LESSON",
    icon: <BookOpen className="size-3" />,
    className: "bg-white/10 text-neutral-200",
  },
  popular: {
    label: "POPULAR",
    icon: <TrendingUp className="size-3" />,
    className: "bg-primary-600/20 text-primary-300",
  },
};

export function Badge({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  const c = config[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[11px] font-semibold tracking-wide",
        c.className,
        className,
      )}
    >
      {c.icon}
      {c.label}
    </span>
  );
}
