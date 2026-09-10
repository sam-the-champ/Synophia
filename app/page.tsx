import Link from "next/link";
import { Sparkles, ArrowRight, Search, Star, Container } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CoursePreviewCard } from "@/components/ui/course-preview-card";
import { TopBar } from "@/components/top-bar";

/* ---------- placeholder content (swap for a GROQ fetch later) ---------- */

const COURSES = [
  {
    title: "Next.js for Production",
    description:
      "Build scalable, high-performance web applications with Next.js.",
    level: "Intermediate",
    duration: "18h 24m",
    modules: "12 modules",
    icon: <span>N</span>,
    iconClassName: "bg-black",
  },
  {
    title: "Docker Essentials",
    description:
      "Containerize applications and streamline your development workflow.",
    level: "Beginner",
    duration: "10h 12m",
    modules: "8 modules",
    icon: <Container className="size-7" />,
    iconClassName: "bg-gradient-to-br from-sky-500 to-primary-600",
  },
  {
    title: "TypeScript Deep Dive",
    description: "Go beyond the basics and write safer, more expressive code.",
    level: "Intermediate",
    duration: "14h 36m",
    modules: "10 modules",
    icon: <span className="text-body-lg">TS</span>,
    iconClassName: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
];

/* ---------- page ---------- */

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-900">
      {/* aurora background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 8% 30%, rgba(99,102,241,0.28), transparent 70%), radial-gradient(50% 40% at 95% 15%, rgba(56,120,255,0.22), transparent 70%), radial-gradient(80% 50% at 50% 115%, rgba(79,70,229,0.35), transparent 70%)",
        }}
      />

      <div className="relative">
        <TopBar />

        <main className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          {/* hero */}
          <section className="flex flex-col items-center pt-20 text-center sm:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-small font-medium uppercase tracking-widest text-neutral-300">
              <Sparkles className="size-3.5 text-primary-400" />
              Intelligent Learning
            </span>

            <h1 className="mt-8 max-w-3xl text-display-2 font-semibold leading-tight text-white sm:text-[3.75rem] sm:leading-[1.1]">
              Search your learning in plain{" "}
              <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
                English.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-body-lg text-neutral-400">
              Vertex understands what you want to learn and finds the exact
              lessons across all your courses.
            </p>

            <div className="mt-9">
              <Button
                className="h-12 bg-gradient-to-r from-primary-500 to-primary-600 px-6 shadow-[0_0_30px_-4px_rgba(99,102,241,0.7)] hover:from-primary-400 hover:to-primary-500"
                icon={<ArrowRight className="size-4" />}
              >
                Explore Courses
              </Button>
            </div>

            {/* search bar */}
            <div className="relative mt-12 w-full max-w-3xl">
              <div className="absolute -inset-1 rounded-2xl bg-primary-500/25 blur-xl" />
              <div className="relative flex h-16 items-center gap-3 rounded-2xl border border-primary-500/40 bg-neutral-800/70 px-5 backdrop-blur">
                <Search className="size-5 text-neutral-400" />
                <input
                  className="h-full flex-1 bg-transparent text-body-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
                  placeholder="Ask anything about your learning..."
                />
                <kbd className="hidden items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-small text-neutral-300 sm:inline-flex">
                  ⌘ K
                </kbd>
              </div>
            </div>
          </section>

          {/* all courses */}
          <section className="pt-24">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-heading-1 font-semibold text-white">
                All Courses
              </h2>
              <Link
                href="#"
                className="inline-flex shrink-0 items-center gap-1.5 text-small text-primary-400 hover:text-primary-300"
              >
                View all courses
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {COURSES.map(({ icon, iconClassName, ...c }) => (
                <CoursePreviewCard
                  key={c.title}
                  icon={icon}
                  iconClassName={cn("text-heading-2", iconClassName)}
                  {...c}
                />
              ))}
            </div>
          </section>

          {/* footer note */}
          <footer className="flex items-center gap-4 py-20 text-small text-neutral-400">
            <span className="h-px flex-1 bg-white/10" />
            <span className="inline-flex items-center gap-2">
              <Star className="size-4 text-primary-400" />
              New courses and lessons added every week.
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </footer>
        </main>
      </div>
    </div>
  );
}
