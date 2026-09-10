import type { ReactNode } from "react";
import {
  ChevronRight,
  BarChart3,
  Clock,
  Layers,
  PlayCircle,
  ExternalLink,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-white/10 bg-neutral-800/60 p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CourseCard({
  icon,
  title,
  description,
  level,
  duration,
  modules,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: string;
}) {
  return (
    <Shell>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-md bg-black text-white">
            {icon}
          </div>
          <span className="text-small text-neutral-400">Course</span>
        </div>
        <ChevronRight className="size-4 text-neutral-500" />
      </div>
      <div>
        <h3 className="text-heading-3 text-white">{title}</h3>
        <p className="mt-1 text-small text-neutral-400">{description}</p>
      </div>
      <div className="flex flex-wrap gap-4 text-small text-neutral-400">
        <span className="inline-flex items-center gap-1.5">
          <BarChart3 className="size-4" />
          {level}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" />
          {duration}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Layers className="size-4" />
          {modules}
        </span>
      </div>
    </Shell>
  );
}

export function VideoMomentCard({
  title,
  description,
  lessonLabel,
  timestamp,
  seekLabel,
}: {
  title: string;
  description: string;
  lessonLabel: string;
  timestamp: string;
  seekLabel: string;
}) {
  return (
    <Shell>
      <div className="flex items-start justify-between">
        <Badge variant="video" />
        <ChevronRight className="size-4 text-neutral-500" />
      </div>
      <div>
        <h3 className="text-heading-3 text-white">{title}</h3>
        <p className="mt-1 text-small text-neutral-400">{description}</p>
      </div>
      <div className="flex items-center justify-between text-small text-neutral-400">
        <span>
          {lessonLabel} · {timestamp}
        </span>
        <span className="inline-flex items-center gap-1.5 text-primary-400">
          <PlayCircle className="size-4" />
          {seekLabel}
        </span>
      </div>
    </Shell>
  );
}

export function LessonCard({
  title,
  description,
  moduleLabel,
}: {
  title: string;
  description: string;
  moduleLabel: string;
}) {
  return (
    <Shell>
      <div className="flex items-start justify-between">
        <Badge variant="lesson" />
        <ChevronRight className="size-4 text-neutral-500" />
      </div>
      <div>
        <h3 className="text-heading-3 text-white">{title}</h3>
        <p className="mt-1 text-small text-neutral-400">{description}</p>
      </div>
      <div className="flex items-center justify-between text-small text-neutral-400">
        <span>{moduleLabel}</span>
        <span className="inline-flex items-center gap-1.5 text-primary-400">
          View lesson
          <ExternalLink className="size-4" />
        </span>
      </div>
    </Shell>
  );
}

export function ResourceCard({
  title,
  description,
  meta,
}: {
  title: string;
  description: string;
  meta: string;
}) {
  return (
    <Shell>
      <div className="flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-sm bg-white/10 px-2 py-1 text-[11px] font-semibold tracking-wide text-neutral-200">
          PDF
        </span>
        <Download className="size-4 text-neutral-500" />
      </div>
      <div>
        <h3 className="text-heading-3 text-white">{title}</h3>
        <p className="mt-1 text-small text-neutral-400">{description}</p>
      </div>
      <span className="text-small text-neutral-400">{meta}</span>
    </Shell>
  );
}
