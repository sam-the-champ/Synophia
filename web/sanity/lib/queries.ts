import { defineQuery } from "next-sanity";

const COURSE_CARD_PROJECTION = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  summary,
  coverImage,
  level,
  price,
  popular,
  studentCount,
  "instructor": instructor->{ name, "slug": slug.current, photo },
  "category": category->{ title, "slug": slug.current }
}`;

const LESSON_REF_PROJECTION = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  poster,
  duration,
  freePreview,
  studentCount
}`;

export const COURSES_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] | order(title asc) ${COURSE_CARD_PROJECTION}
`);

export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    "instructor": instructor->{ name, "slug": slug.current, photo, expertise, bio },
    "category": category->{ title, "slug": slug.current },
    modules[]{
      _key,
      title,
      summary,
      "lessons": lessons[]->${LESSON_REF_PROJECTION}
    }
  }
`);

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    poster,
    duration,
    freePreview,
    studentCount,
    notes,
    keyPoints,
    proTip,
    resources[]
  }
`);

export const COURSE_FOR_LESSON_QUERY = defineQuery(`
  *[_type == "course" && references($lessonId)][0]{
    title,
    "slug": slug.current,
    modules[]{
      title,
      "lessons": lessons[]->{ _id, "slug": slug.current, title }
    }
  }
`);

export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id) && defined(slug.current)] ${COURSE_CARD_PROJECTION}
  }
`);

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc){
    title,
    "slug": slug.current,
    description
  }
`);
