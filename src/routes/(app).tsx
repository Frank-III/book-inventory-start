import {
  cache,
  createAsync,
  Params,
  RouteDefinition,
  useSearchParams,
} from "@solidjs/router";
import { fetchAuthors } from "~/api/server";
import { Sidebar } from "~/components/authors";
import { Search } from "~/components/search";
import { cn } from "~/lib/utils";

const fetchAs = cache(() => fetchAuthors(), "authors");

export const route = {
  load({ location, params }) {
    return fetchAs();
  },
} satisfies RouteDefinition;

const Page = (props) => {
  const [searchParams, _] = useSearchParams();
  const authors = createAsync(() => fetchAs());

  const selectedAuthors = !searchParams.author
    ? []
    : typeof searchParams.author === "string"
      ? [searchParams.author]
      : searchParams.author;
  const query = searchParams?.q || "";
  return (
    <>
      <main
        class={cn(
          "min-h-[calc(100dvh)] bg-white font-sans antialiased dark:bg-black dark:text-white",
        )}
      >
        <div class="group flex h-[calc(100dvh)] w-full overflow-hidden">
          <div class="hidden md:block">
            <Sidebar selectedAuthors={selectedAuthors} allAuthors={authors} />
          </div>
          <div class="flex flex-1 flex-col">
            // <div class="border-b"></div>
            <div class="border-b">
              <Search query={query} />
            </div>
            <div class="flex-1 flex flex-col overflow-hidden">
              {props.children}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
