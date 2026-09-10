import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-12 w-full rounded-md border border-white/[0.12] bg-white/5 px-3 text-body text-neutral-100 placeholder:text-neutral-500 transition-colors focus:border-primary-500 focus:outline-none";

export function Input({
  className,
  withSearchIcon = true,
  shortcut,
  ...props
}: ComponentProps<"input"> & { withSearchIcon?: boolean; shortcut?: string }) {
  return (
    <div className="relative">
      {withSearchIcon && (
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
      )}
      <input
        className={cn(fieldClass, withSearchIcon && "pl-10", shortcut && "pr-14", className)}
        {...props}
      />
      {shortcut && (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/15 px-1.5 py-0.5 text-xs text-neutral-300">
          {shortcut}
        </kbd>
      )}
    </div>
  );
}

export function Select({
  className,
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-12 w-full appearance-none rounded-md border border-white/[0.12] bg-white/5 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat px-3 pr-10 text-body text-neutral-100 transition-colors focus:border-primary-500 focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
