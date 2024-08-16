import { useSearchParams } from "@solidjs/router";
import { Search as SearchComponent } from "~/components/search";

export default function Search() {
  const [searchParams, _] = useSearchParams();
  const query = searchParams?.q || "";

  return <SearchComponent />;
}
