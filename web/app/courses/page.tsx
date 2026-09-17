import type { Metadata } from "next";
import { TopBar } from "@/components/top-bar";
import { CoursePreviewCard } from "@/components/ui/course-preview-card";
import { getCourses } from "@/sanity/lib/courses";
import { formatDuration, capitalize } from "@/lib/format";

export const metadata: Metadata = {
  title: "All Courses | Synophia",
  description: "Browse every course on Synophia.",
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-neutral-900">
      <TopBar />

      <main className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
        <div className="pt-10">
          <h1 className="text-heading-1 font-semibold text-white">All Courses</h1>
          <p className="mt-2 text-body text-neutral-400">
            {courses.length} course{courses.length === 1 ? "" : "s"} available
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CoursePreviewCard
              key={course._id}
              slug={course.slug ?? ""}
              coverImage={course.coverImage ?? null}
              title={course.title ?? ""}
              description={course.summary ?? ""}
              level={capitalize(course.level ?? "beginner")}
              duration={formatDuration(course.totalSeconds ?? 0)}
              modules={`${course.moduleCount ?? 0} modules`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
