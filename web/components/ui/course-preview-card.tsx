import Link from "next/link";
import Image from "next/image";
import { BarChart3, Clock, FileText } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

export function CoursePreviewCard({
  slug,
  coverImage,
  title,
  description,
  level,
  duration,
  modules,
}: {
  slug: string;
  coverImage: SanityImageSource | null;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: string;
}) {
  return (
    <Link
      href={`/courses/${slug}`}
      className="flex flex-col rounded-xl border border-white/10 bg-neutral-800/30 p-5 shadow-[0_0_40px_-12px_rgba(99,102,241,0.35)] transition-colors hover:border-primary-500/50"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-900">
        {coverImage && (
          <Image
            src={urlFor(coverImage).width(400).height(225).fit("crop").url()}
            alt={`Cover image for ${title}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>

      <h3 className="mt-5 text-heading-3 font-semibold text-white">{title}</h3>
      <p className="mt-2 flex-1 text-small text-neutral-400">{description}</p>

      <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-small text-neutral-400">
        <span className="inline-flex items-center gap-1.5">
          <BarChart3 className="size-4" />
          {level}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" />
          {duration}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FileText className="size-4" />
          {modules}
        </span>
      </div>
    </Link>
  );
}
