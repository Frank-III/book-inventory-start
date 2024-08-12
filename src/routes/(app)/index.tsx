import {
  cache,
  createAsync,
  useSearchParams,
  type RouteDefinition,
} from "@solidjs/router";
import { Suspense } from "solid-js";
import { fetchBooksWithPagination } from "~/api/server";
import { BooksGrid } from "~/components/grid";

function queryStringToObject(url: string) {
  const queryString = url.split("?")[1];
  const urlParams = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  for (const [key, value] of urlParams) {
    result[key] = value;
  }

  return result;
}

export const route = {
  preload({ location, params }) {
    // parse searchParams from location.search string
    "use server";
    return cache(
      async () => await fetchBooksWithPagination(location.query),
      "books",
    );
  },
} satisfies RouteDefinition;

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const books = createAsync(
    async () => await fetchBooksWithPagination(searchParams),
  );
  return (
    <div class="flex flex-col h-full">
      <div class="flex-grow overflow-auto min-h-[200px]">
        <div class="group-has-[[data-pending]]:animate-pulse p-4">
          <BooksGrid books={() => books()?.books} />
        </div>
      </div>
      <div class="mt-auto p-4 border-t">
        <Suspense fallback={null}>
          {(() => {
            const bookk = books();
            return (
              <p>Paginate</p>
              // <BookPagination
              //   currentPage={bookk?.pagination.currentPage}
              //   totalPages={bookk?.pagination.totalPages}
              //   searchParams={searchParams}
              // />
            );
          })()}
        </Suspense>
      </div>
    </div>
  );
}
