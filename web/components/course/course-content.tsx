"use client";

import { useState } from "react";
import { ChevronDown, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";

type Lesson = {
  _id: string;
  title: string | null;
  duration: number | null;
  freePreview: boolean | null;
};

type Module = {
  _key: string;
  title: string | null;
  summary: string | null;
  lessons: Lesson[];
};

const COLLAPSED_MODULE_LIMIT = 6;

function moduleDuration(lessons: Lesson[]): number {
  return lessons.reduce((sum, lesson) => sum + (lesson.duration ?? 0), 0);
}

function ModuleRow({ index, module }: { index: number; module: Module }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 py-4 text-left"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-600/20 text-small font-semibold text-primary-300">
          {index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-body font-medium text-white">{module.title}</span>
          {module.summary && (
            <span className="mt-0.5 block truncate text-small text-neutral-400">
              {module.summary}
            </span>
          )}
        </span>
        <span className="shrink-0 text-small text-neutral-400">
          {formatDuration(moduleDuration(module.lessons))}
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-neutral-500 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul className="flex flex-col gap-1 pb-4 pl-12">
          {module.lessons.map((lesson) => (
            <li
              key={lesson._id}
              className="flex items-center gap-3 rounded-md py-2 text-small text-neutral-300"
            >
              <PlayCircle className="size-4 shrink-0 text-neutral-500" />
              <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
              {lesson.freePreview && (
                <span className="shrink-0 rounded-sm bg-white/10 px-1.5 py-0.5 text-[11px] font-medium text-neutral-300">
                  Free preview
                </span>
              )}
              <span className="shrink-0 text-neutral-500">
                {formatDuration(lesson.duration ?? 0)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function CourseContent({ modules }: { modules: Module[] }) {
  const [showAll, setShowAll] = useState(false);

  const visibleModules =
    showAll || modules.length <= COLLAPSED_MODULE_LIMIT
      ? modules
      : modules.slice(0, COLLAPSED_MODULE_LIMIT);

  const totalSeconds = modules.reduce((sum, m) => sum + moduleDuration(m.lessons), 0);

  return (
    <section className="rounded-xl border border-white/10 bg-neutral-800/40 p-6 sm:p-8">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-heading-2 font-semibold text-white">Course Content</h2>
        <span className="text-small text-neutral-400">
          {modules.length} modules · {formatDuration(totalSeconds)}
        </span>
      </div>

      <ul className="mt-4">
        {visibleModules.map((module, i) => (
          <ModuleRow key={module._key} index={i + 1} module={module} />
        ))}
      </ul>

      {modules.length > COLLAPSED_MODULE_LIMIT && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-small text-neutral-300 hover:bg-white/5"
        >
          {showAll ? "Show fewer modules" : `Show all ${modules.length} modules`}
          <ChevronDown className={cn("size-4 transition-transform", showAll && "rotate-180")} />
        </button>
      )}
    </section>
  );
}
