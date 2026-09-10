import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  showLabel = true,
  className,
}: {
  value: number;
  showLabel?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-primary-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-small text-neutral-300">{pct}% complete</span>
      )}
    </div>
  );
}
