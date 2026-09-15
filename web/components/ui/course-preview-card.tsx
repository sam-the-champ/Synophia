import type { ReactNode } from "react";
import { BarChart3, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function CoursePreviewCard({
  icon,
  iconClassName,
  title,
  description,
  level,
  duration,
  modules,
}: {
  icon: ReactNode;
  iconClassName?: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: string;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-white/10 bg-neutral-800/30 p-5 shadow-[0_0_40px_-12px_rgba(99,102,241,0.35)] transition-colors hover:border-primary-500/50">
      <div
        className={cn(
          "grid size-14 place-items-center rounded-xl text-heading-3 font-bold text-white",
          iconClassName,
        )}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-heading-3 font-semibold text-white">{title}</h3>
      <p className="mt-2 flex-1 text-small text-neutral-400">{description}</p>

      <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-small text-neutral-400">
        <span className="inline-flex items-center gap-1.5">
          <BarChart3 className="size-4" />
          {level}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" />
          {duration}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FileText className="size-4" />
          {modules}
        </span>
      </div>
    </article>
  );
}
