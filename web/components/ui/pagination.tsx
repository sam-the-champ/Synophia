import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  className,
}: {
  page: number;
  totalPages: number;
  className?: string;
}) {
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className={cn("flex items-center gap-2", className)} aria-label="Pagination">
      <button className="grid size-9 place-items-center rounded-md border border-white/10 text-neutral-300 hover:bg-white/5">
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-1 text-neutral-500">
            …
          </span>
        ) : (
          <button
            key={p}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "grid size-9 place-items-center rounded-md text-small",
              p === page
                ? "bg-primary-600 text-white"
                : "border border-white/10 text-neutral-300 hover:bg-white/5",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button className="grid size-9 place-items-center rounded-md border border-white/10 text-neutral-300 hover:bg-white/5">
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
