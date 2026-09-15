import "server-only";

import type { QueryParams } from "next-sanity";

import { client } from "./client";

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
  useCdn = true,
}: {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
  useCdn?: boolean;
}) {
  return client.withConfig({ useCdn }).fetch(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
