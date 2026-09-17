import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight } from "lucide-react";
import { getCourseBySlug } from "@/sanity/lib/courses";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CourseHero } from "@/components/course/course-hero";
import { WhatYoullLearn } from "@/components/course/what-youll-learn";
import { CourseContent } from "@/components/course/course-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) return {};

  return {
    title: `${course.title} | Synophia`,
    description: course.summary,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course || !course.title || !course.summary) {
    notFound();
  }

  const modules = (course.modules ?? []).map((module) => ({
    _key: module._key,
    title: module.title,
    summary: module.summary,
    lessons: (module.lessons ?? []).filter((lesson) => lesson !== null),
  }));

  const outcomes = (course.whatYoullLearn ?? []).flatMap((outcome) =>
    outcome.icon && outcome.title && outcome.description
      ? [
          {
            _key: outcome._key,
            icon: outcome.icon,
            title: outcome.title,
            description: outcome.description,
          },
        ]
      : [],
  );

  return (
    <div className="min-h-screen bg-neutral-900">
      <TopBar />

      <main className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 pt-6 text-small text-neutral-400">
          <Link href="/" className="hover:text-neutral-200">
            All Courses
          </Link>
          <ChevronRight className="size-4" />
          <span className="truncate text-neutral-200">{course.title}</span>
        </nav>

        <CourseHero
          title={course.title}
          summary={course.summary}
          coverImage={course.coverImage ?? null}
          coverAlt={`Cover image for ${course.title}`}
          level={course.level ?? "beginner"}
          totalSeconds={course.totalSeconds ?? 0}
          moduleCount={modules.length}
          studentCount={course.studentCount ?? null}
          popular={Boolean(course.popular)}
        />

        <div className="mt-10 flex flex-col gap-8">
          <WhatYoullLearn outcomes={outcomes} />

          <CourseContent modules={modules} />

          <section className="flex flex-col gap-4 rounded-xl border border-white/10 bg-neutral-800/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex-1">
              <p className="text-body font-medium text-white">Your Progress</p>
              <ProgressBar value={0} className="mt-3 max-w-md" />
            </div>
            <Button
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500"
              icon={<ArrowRight className="size-4" />}
            >
              Continue Learning
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
