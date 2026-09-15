import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const TYPE_OPTIONS = [
  { title: "PDF", value: "pdf" },
  { title: "Code", value: "code" },
  { title: "Link", value: "link" },
  { title: "Download", value: "download" },
];

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "type",
      type: "string",
      options: { list: TYPE_OPTIONS, layout: "dropdown" },
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
    }),
    defineField({
      name: "url",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "type" },
  },
});
