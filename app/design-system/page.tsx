import type { ReactNode } from "react";
import {
  Bell,
  Search,
  Compass,
  FileText,
  Bookmark,
  BarChart3,
  Clock,
  User,
  ChevronRight,
  Play,
  Eye,
  LayoutGrid,
  Target,
  Accessibility,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Status } from "@/components/ui/status";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Pagination } from "@/components/ui/pagination";
import {
  CourseCard,
  VideoMomentCard,
  LessonCard,
  ResourceCard,
} from "@/components/ui/card";

/* ---------- local helpers ---------- */

function Panel({
  index,
  title,
  children,
  className,
}: {
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-neutral-800/40 p-6 ${className ?? ""}`}
    >
      <header className="mb-6 flex items-center gap-3">
        <span className="rounded-sm bg-white/10 px-2 py-0.5 text-small font-medium text-neutral-300">
          {index}
        </span>
        <h2 className="text-small font-semibold uppercase tracking-widest text-neutral-400">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

function Swatch({
  name,
  hex,
  className,
}: {
  name: string;
  hex: string;
  className?: string;
}) {
  return (
    <div>
      <div
        className={`h-20 rounded-md border border-white/10 ${className ?? ""}`}
        style={{ backgroundColor: hex }}
      />
      <p className="mt-2 text-small text-neutral-200">{name}</p>
      <p className="text-small text-neutral-500">{hex}</p>
    </div>
  );
}

const primary = [
  ["Primary 600", "#6366F1"],
  ["Primary 500", "#818CF8"],
  ["Primary 400", "#A5B4FC"],
  ["Primary 300", "#C7D2FE"],
  ["Primary 200", "#E0E7FF"],
  ["Primary 100", "#EEF2FF"],
];

const neutral = [
  ["Neutral 900", "#0B0F19"],
  ["Neutral 800", "#1E293B"],
  ["Neutral 700", "#334155"],
  ["Neutral 500", "#64748B"],
  ["Neutral 300", "#CBD5E1"],
  ["Neutral 200", "#E2E8F0"],
  ["Neutral 100", "#F1F5F9"],
  ["White", "#FFFFFF"],
];

const typeScale = [
  ["Display 1", "56 / 64", "Semibold", "Hero titles", "text-display-1"],
  ["Display 2", "40 / 48", "Semibold", "Section titles", "text-display-2"],
  ["Heading 1", "32 / 40", "Semibold", "Card titles", "text-heading-1"],
  ["Heading 2", "24 / 32", "Medium", "Sub section", "text-heading-2"],
  ["Heading 3", "20 / 28", "Medium", "Small titles", "text-heading-3"],
  ["Body Large", "18 / 26", "Regular", "Body copy", "text-body-lg"],
  ["Body", "16 / 24", "Regular", "Supporting text", "text-body"],
  ["Small", "14 / 20", "Regular", "Captions, meta", "text-small"],
];

const spacing = [
  ["4", "0.25rem", 4],
  ["8", "0.5rem", 8],
  ["12", "0.75rem", 12],
  ["16", "1rem", 16],
  ["24", "1.5rem", 24],
  ["32", "2rem", 32],
  ["40", "2.5rem", 40],
  ["48", "3rem", 48],
  ["64", "4rem", 64],
] as const;

const radii = [
  ["4px", "xs", "rounded-xs"],
  ["8px", "sm", "rounded-sm"],
  ["12px", "md", "rounded-md"],
  ["16px", "lg", "rounded-lg"],
  ["24px", "xl", "rounded-xl"],
  ["Full", "circle", "rounded-full"],
];

const shadows = [
  ["Sm", "shadow-sm"],
  ["Md", "shadow-md"],
  ["Lg", "shadow-lg"],
  ["Xl", "shadow-xl"],
];

const icons = [Bell, Search, Compass, FileText, Bookmark, BarChart3, Clock, User];

const principles = [
  { Icon: Eye, title: "Clarity First", body: "Every element should communicate clearly." },
  {
    Icon: LayoutGrid,
    title: "Consistency",
    body: "Use components and patterns consistently across the platform.",
  },
  {
    Icon: Target,
    title: "Focus & Calm",
    body: "Remove noise and help learners focus on what matters.",
  },
  {
    Icon: Accessibility,
    title: "Accessible",
    body: "Design with accessibility and inclusivity in mind.",
  },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-neutral-900 px-4 py-10 text-neutral-100 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* Hero + Colors */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-md bg-primary-600 text-white">
                <span className="text-lg font-bold">S</span>
              </div>
              <span className="text-heading-2 font-semibold">Synophia</span>
            </div>
            <p className="text-small font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Design System
            </p>
            <h1 className="text-display-2 font-semibold">
              Build Beautiful Products{" "}
              <span className="text-primary-400">Faster</span>
            </h1>
            <p className="max-w-sm text-body text-neutral-400">
              A modern, cohesive design system for building intuitive, elegant and
              high-performing products. Crafted for clarity, consistency and
              creativity.
            </p>
            <p className="text-small text-neutral-500">v1.0 · May 2025</p>
          </div>

          <Panel index="01" title="Colors">
            <p className="mb-3 text-small font-medium text-neutral-300">Primary</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {primary.map(([name, hex]) => (
                <Swatch key={name} name={name} hex={hex} />
              ))}
            </div>
            <p className="mb-3 mt-6 text-small font-medium text-neutral-300">Neutral</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {neutral.map(([name, hex]) => (
                <Swatch key={name} name={name} hex={hex} />
              ))}
            </div>
          </Panel>
        </div>

        {/* Typography + Type scale */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel index="02" title="Typography">
            <div className="space-y-6">
              <div className="flex items-baseline gap-6">
                <span className="text-[64px] font-semibold leading-none">Aa</span>
                <div>
                  <p className="text-heading-3">Inter</p>
                  <p className="text-small text-neutral-400">
                    Modern · Clean · Highly legible
                  </p>
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-baseline gap-6">
                <span className="text-[64px] font-light leading-none text-neutral-300">
                  Aa
                </span>
                <div>
                  <p className="text-heading-3">Display</p>
                  <p className="text-small text-neutral-400">
                    Elegant · Friendly · Expressive
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel index="03" title="Type Scale">
            <table className="w-full text-left text-small">
              <thead className="text-neutral-500">
                <tr>
                  <th className="pb-3 font-medium">Style</th>
                  <th className="pb-3 font-medium">Size / Line</th>
                  <th className="pb-3 font-medium">Weight</th>
                  <th className="pb-3 font-medium">Use</th>
                </tr>
              </thead>
              <tbody className="text-neutral-200">
                {typeScale.map(([style, size, weight, use]) => (
                  <tr key={style} className="border-t border-white/5">
                    <td className="py-2 font-medium">{style}</td>
                    <td className="py-2 text-neutral-400">{size}</td>
                    <td className="py-2 text-neutral-400">{weight}</td>
                    <td className="py-2 text-neutral-400">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        {/* Spacing + Radius/Shadows */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel index="04" title="Spacing System">
            <p className="mb-6 text-small text-neutral-400">Base unit: 8px</p>
            <div className="flex flex-wrap items-end gap-4">
              {spacing.map(([label, rem, px]) => (
                <div key={label} className="text-center">
                  <div
                    className="rounded-sm bg-primary-500/80"
                    style={{ width: px, height: px }}
                  />
                  <p className="mt-2 text-small text-neutral-200">{label}</p>
                  <p className="text-xs text-neutral-500">{rem}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel index="05" title="Radius & Shadows">
            <p className="mb-3 text-small font-medium text-neutral-300">Radius</p>
            <div className="flex flex-wrap gap-4">
              {radii.map(([label, sub, cls]) => (
                <div key={label} className="text-center">
                  <div
                    className={`size-14 border border-white/10 bg-primary-500/30 ${cls}`}
                  />
                  <p className="mt-2 text-small text-neutral-200">{label}</p>
                  <p className="text-xs text-neutral-500">{sub}</p>
                </div>
              ))}
            </div>
            <p className="mb-3 mt-6 text-small font-medium text-neutral-300">Shadows</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {shadows.map(([label, cls]) => (
                <div
                  key={label}
                  className={`grid h-20 place-items-center rounded-md bg-neutral-800 text-small text-neutral-300 ${cls}`}
                >
                  {label}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Icons + Buttons + Inputs */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel index="06" title="Icons">
            <p className="mb-4 text-small text-neutral-400">Outline &amp; Filled · 24px</p>
            <div className="flex flex-wrap gap-4 text-neutral-200">
              {icons.map((Icon, i) => (
                <Icon key={i} className="size-6" strokeWidth={2} />
              ))}
              <ChevronRight className="size-6" strokeWidth={2} />
            </div>
            <ul className="mt-6 space-y-1 text-small text-neutral-400">
              <li>24×24px grid</li>
              <li>2px stroke width (outline)</li>
              <li>Rounded line caps</li>
              <li>Consistent optical balance</li>
            </ul>
          </Panel>

          <Panel index="07" title="Buttons">
            <div className="space-y-4">
              {(
                [
                  ["Default", false],
                  ["Hover", false],
                  ["Disabled", true],
                ] as const
              ).map(([label, disabled]) => (
                <div key={label} className="flex flex-wrap items-center gap-3">
                  <span className="w-16 text-small text-neutral-500">{label}</span>
                  <Button variant="primary" disabled={disabled}>
                    Get Started
                  </Button>
                  <Button variant="secondary" disabled={disabled}>
                    Explore Courses
                  </Button>
                  <Button
                    variant="tertiary"
                    disabled={disabled}
                    icon={<ChevronRight className="size-4" />}
                  >
                    View Lesson
                  </Button>
                  <Button
                    variant="text"
                    disabled={disabled}
                    icon={<Play className="size-4 fill-current" />}
                  >
                    Watch Video
                  </Button>
                </div>
              ))}
            </div>
            <ul className="mt-6 space-y-1 text-small text-neutral-400">
              <li>Height: 48px (default)</li>
              <li>Padding: 0 16px</li>
              <li>Radius: 12px</li>
              <li>Font: Inter Medium (14–16px)</li>
            </ul>
          </Panel>

          <Panel index="08" title="Inputs">
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-small text-neutral-400">Search / Text Input</p>
                <Input placeholder="Search anything..." shortcut="⌘K" />
              </div>
              <div>
                <p className="mb-2 text-small text-neutral-400">Select</p>
                <Select defaultValue="relevant">
                  <option value="relevant">Most Relevant</option>
                  <option value="newest">Newest</option>
                </Select>
              </div>
            </div>
            <ul className="mt-6 space-y-1 text-small text-neutral-400">
              <li>Height: 48px</li>
              <li>Radius: 12px</li>
              <li>Border: 1px solid rgba(255,255,255,0.12)</li>
              <li>Focus: border color #818CF8</li>
            </ul>
          </Panel>
        </div>

        {/* Badges + Status + Progress */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel index="09" title="Badges / Tags">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="mb-2 text-small text-neutral-500">Video</p>
                <Badge variant="video" />
              </div>
              <div>
                <p className="mb-2 text-small text-neutral-500">Lesson</p>
                <Badge variant="lesson" />
              </div>
              <div>
                <p className="mb-2 text-small text-neutral-500">Popular</p>
                <Badge variant="popular" />
              </div>
            </div>
          </Panel>

          <Panel index="10" title="Status / Indicators">
            <div className="flex flex-wrap gap-4">
              <Status variant="in-progress" />
              <Status variant="completed" />
              <Status variant="now-playing" />
              <Status variant="locked" />
            </div>
          </Panel>

          <Panel index="11" title="Progress Bar">
            <ProgressBar value={35} />
          </Panel>
        </div>

        {/* Cards */}
        <Panel index="12" title="Cards">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <CourseCard
              icon={<span className="text-sm font-bold">N</span>}
              title="Next.js for Production"
              description="Build scalable, high-performance web applications with Next.js."
              level="Intermediate"
              duration="18h 24m"
              modules="12 modules"
            />
            <VideoMomentCard
              title="Data Fetching in Server Components"
              description="Learn how to fetch data on the server using async/await and Next.js best practices."
              lessonLabel="Lesson 5.1"
              timestamp="12:45"
              seekLabel="Watch from 12:45"
            />
            <LessonCard
              title="Data Fetching & Caching"
              description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
              moduleLabel="Module 5"
            />
            <ResourceCard
              title="Caching and Revalidation Guide"
              description="Deep dive into Next.js caching strategies."
              meta="PDF · 1.2 MB"
            />
          </div>
        </Panel>

        {/* Navigation */}
        <Panel index="13" title="Navigation">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-md bg-primary-600 text-xs font-bold text-white">
                  S
                </div>
                <span className="font-semibold">Synophia</span>
              </div>
              <span className="rounded-md bg-primary-600/30 px-3 py-1 text-small text-primary-200">
                Courses
              </span>
              <span className="text-small text-neutral-400">My Learning</span>
            </div>
            <div className="flex items-center gap-2 text-small text-neutral-400">
              <span>All Courses</span>
              <ChevronRight className="size-4" />
              <span>Next.js for Production</span>
              <ChevronRight className="size-4" />
              <span className="text-neutral-200">Data Fetching &amp; Caching</span>
            </div>
            <Pagination page={1} totalPages={8} />
          </div>
        </Panel>

        {/* Principles */}
        <Panel index="14" title="Principles">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(({ Icon, title, body }) => (
              <div key={title} className="flex flex-col gap-2">
                <Icon className="size-6 text-primary-400" strokeWidth={2} />
                <p className="text-heading-3">{title}</p>
                <p className="text-small text-neutral-400">{body}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
