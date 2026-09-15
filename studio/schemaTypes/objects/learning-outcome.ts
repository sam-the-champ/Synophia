import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const ICON_OPTIONS = [
  { title: "Video", value: "video" },
  { title: "Code", value: "code" },
  { title: "Certificate", value: "certificate" },
  { title: "Community", value: "community" },
  { title: "Lifetime access", value: "lifetime-access" },
  { title: "Support", value: "support" },
];

export const learningOutcome = defineType({
  name: "learningOutcome",
  title: "Learning outcome",
  type: "object",
  icon: StarIcon,
  fields: [
    defineField({
      name: "icon",
      type: "string",
      options: { list: ICON_OPTIONS, layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "icon" },
  },
});
