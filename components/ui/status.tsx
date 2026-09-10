import { CheckCircle2, Circle, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "in-progress" | "completed" | "now-playing" | "locked";

const config: Record<
  Variant,
  { label: string; icon: React.ReactNode; className: string }
> = {
  "in-progress": {
    label: "In Progress",
    icon: <Circle className="size-4 fill-primary-500 text-primary-500" />,
    className: "text-neutral-200",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="size-4 text-emerald-400" />,
    className: "text-neutral-200",
  },
  "now-playing": {
    label: "Now Playing",
    icon: <PlayCircle className="size-4 text-primary-400" />,
    className: "text-neutral-200",
  },
  locked: {
    label: "Locked",
    icon: <Lock className="size-4 text-neutral-500" />,
    className: "text-neutral-400",
  },
};

export function Status({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  const c = config[variant];
  return (
    <span className={cn("inline-flex items-center gap-2 text-small", c.className, className)}>
      {c.icon}
      {c.label}
    </span>
  );
}
