import { PlayIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const lesson = defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "duration",
      title: "Duration (seconds)",
      type: "number",
      validation: (rule) => rule.required().positive().integer(),
    }),
    defineField({
      name: "freePreview",
      title: "Free preview",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "studentCount",
      title: "Student count",
      type: "number",
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "notes",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "keyPoints",
      title: "Key points",
      description: 'Short list for the "In this lesson you will" section.',
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "proTip",
      title: "Pro tip",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "resources",
      type: "array",
      of: [defineArrayMember({ type: "resource" })],
    }),
  ],
  preview: {
    select: { title: "title", media: "poster" },
  },
});
