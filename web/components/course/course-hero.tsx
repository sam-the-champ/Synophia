import Image from "next/image";
import { BarChart3, Clock, FileText, Users, ArrowRight, Bookmark } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { formatDuration, formatCompactNumber, capitalize } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SanityImageSource } from "@sanity/image-url";

function GradientTitle({ title }: { title: string }) {
  const words = title.trim().split(" ");
  const lastWord = words.pop();

  return (
    <h1 className="text-display-2 font-semibold leading-tight text-white sm:text-[3.25rem] sm:leading-[1.1]">
      {words.length > 0 ? `${words.join(" ")} ` : ""}
      <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
        {lastWord}
      </span>
    </h1>
  );
}

export function CourseHero({
  title,
  summary,
  coverImage,
  coverAlt,
  level,
  totalSeconds,
  moduleCount,
  studentCount,
  popular,
}: {
  title: string;
  summary: string;
  coverImage: SanityImageSource | null;
  coverAlt: string;
  level: string;
  totalSeconds: number;
  moduleCount: number;
  studentCount: number | null;
  popular: boolean;
}) {
  return (
    <section className="grid gap-8 pt-8 sm:grid-cols-[280px_1fr] sm:pt-10">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-800">
        {coverImage && (
          <Image
            src={urlFor(coverImage).width(560).height(560).fit("crop").url()}
            alt={coverAlt}
            fill
            sizes="(min-width: 640px) 280px, 100vw"
            className="object-cover"
            priority
          />
        )}
      </div>

      <div className="flex flex-col justify-center">
        {popular && <Badge variant="popular" className="mb-4 w-fit" />}

        <GradientTitle title={title} />

        <p className="mt-4 max-w-xl text-body-lg text-neutral-400">{summary}</p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-small text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <BarChart3 className="size-4" />
            {capitalize(level)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" />
            {formatDuration(totalSeconds)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-4" />
            {moduleCount} modules
          </span>
          {studentCount != null && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4" />
              {formatCompactNumber(studentCount)} students
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500"
            icon={<ArrowRight className="size-4" />}
          >
            Continue Learning
          </Button>
          <Button variant="secondary">
            <Bookmark className="size-4" />
            Bookmark
          </Button>
        </div>
      </div>
    </section>
  );
}
