import { DocumentTextIcon, PlayIcon, TagIcon, UserIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

const ORDERED_TYPES = [
  { type: "course", title: "Courses", icon: DocumentTextIcon },
  { type: "lesson", title: "Lessons", icon: PlayIcon },
  { type: "instructor", title: "Instructors", icon: UserIcon },
  { type: "category", title: "Categories", icon: TagIcon },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...ORDERED_TYPES.map(({ type, title, icon }) =>
        S.listItem()
          .title(title)
          .icon(icon)
          .child(S.documentTypeList(type).title(title))
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !ORDERED_TYPES.some(({ type }) => type === item.getId())
      ),
    ]);
