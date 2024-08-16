import { cache } from "@solidjs/router";
import { fetchBooksWithPagination } from "./server";

export const fetchBooks = cache(
  async (search: Record<string, unknown>) =>
    await fetchBooksWithPagination(search),
  "books",
);
