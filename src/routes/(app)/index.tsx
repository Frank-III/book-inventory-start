import {
  cache,
  createAsync,
  useSearchParams,
  type RouteDefinition,
} from "@solidjs/router";
import {
  createEffect,
  Suspense,
  createResource,
  createRenderEffect,
} from "solid-js";
import { fetchBooks } from "~/api/cachedApi";
import { BooksGrid } from "~/components/grid";
import { fetchBooksWithPagination } from "~/api/server";
import { unwrap } from "solid-js/store";

export const route = {
  load({ location, params }) {
    return fetchBooks(location.query);
  },
} satisfies RouteDefinition;

export default function Home() {
  const [searchParams, _] = useSearchParams();
  // const [searchParams, _] = useSearchParams<{
  //   q?: string;
  //   page?: string;
  //   author?: string;
  // }>();

  const [books, { refetch }] = createResource(
    () => unwrap(searchParams),
    fetchBooksWithPagination,
  );

  createEffect(() => {
    unwrap(searchParams);
    refetch();
  });

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
