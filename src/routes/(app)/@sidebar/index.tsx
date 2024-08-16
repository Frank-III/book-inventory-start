import {
  cache,
  createAsync,
  RouteDefinition,
  useSearchParams,
} from "@solidjs/router";
import { fetchAuthors } from "~/api/server";
import { Sidebar as SidebarComponent } from "~/components/authors";

export const route = {
  load({ location, params }) {
    "use server";
    return cache(() => fetchAuthors(), "authors");
  },
} satisfies RouteDefinition;

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const authors = createAsync(() => fetchAuthors());

  const selectedAuthors = !searchParams.author
    ? []
    : typeof searchParams.author === "string"
      ? [searchParams.author]
      : searchParams.author;
  return (
    <SidebarComponent selectedAuthors={selectedAuthors} allAuthors={authors} />
  );
};

export default Sidebar;
