import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "tertiary" | "text";

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-small font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";

const variants: Record<Variant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-500",
  secondary:
    "border border-white/15 bg-white/5 text-neutral-100 hover:border-primary-500 hover:bg-white/10",
  tertiary: "text-neutral-100 hover:text-primary-400",
  text: "text-primary-400 hover:text-primary-300",
};

export function Button({
  variant = "primary",
  className,
  children,
  icon,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; icon?: ReactNode }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
      {icon}
    </button>
  );
}
