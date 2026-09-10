"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Courses", href: "#", active: true },
  { label: "My Learning", href: "#", active: false },
];

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-primary-500 to-primary-600 text-body font-bold text-white">
        S
      </div>
      <span className="text-heading-3 font-semibold text-white">Synophia</span>
    </div>
  );
}

export function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="mx-auto w-full max-w-5xl rounded-xl border border-white/10 bg-neutral-800/40 backdrop-blur">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
          <Logo />

          {/* desktop nav */}
          <nav className="ml-4 hidden items-center gap-2 text-small md:flex">
            {NAV.map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-1.5",
                  active
                    ? "bg-white/10 font-medium text-white"
                    : "text-neutral-400 hover:text-neutral-100",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative grid size-9 place-items-center rounded-full text-neutral-300 hover:bg-white/5"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary-400" />
            </button>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-full px-4 py-1.5 text-small text-neutral-300 hover:text-white"
                >
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-br from-primary-500 to-primary-600 px-4 py-1.5 text-small font-medium text-white hover:from-primary-400 hover:to-primary-500"
                >
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{ elements: { userButtonAvatarBox: "size-9" } }}
              />
            </Show>

            {/* mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-full text-neutral-300 hover:bg-white/5 md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* mobile nav panel */}
        {open && (
          <nav className="flex flex-col gap-1 border-t border-white/10 p-3 md:hidden">
            {NAV.map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-body",
                  active
                    ? "bg-white/10 font-medium text-white"
                    : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
