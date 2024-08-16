import { Accessor, batch, createSignal, Show } from "solid-js";
import {
  TextField,
  TextFieldInput,
} from "~/components/ui/text-field";
import { useDebounce, useDebounceCallback } from "~/lib/utils";
import {
  useIsRouting,
  useSearchParams,
} from "@solidjs/router";

// TODO: I don't know what to do with this code yet.
export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = createSignal(searchParams.q ?? "");
  const onPress = (v: Accessor<string>) => {
    const value = v();
    setSearchParams({ q: value });
    // reload({
    //   revalidate: fetchBooks.keyFor({ ...unwrap(searchParams), q: value }),
    // });
  };
  const debounceSearch = useDebounceCallback(() => {
    onPress(query);
  }, 500);

  const handleInputChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    setQuery(value);
    debounceSearch();
  };

  return (
    <form class="relative flex flex-1 flex-shrink-0 w-full">
      <label for="search" class="sr-only">
        Search
      </label>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width={1.5}
        stroke="currentColor"
        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <TextField>
        <TextFieldInput
          onInput={handleInputChange}
          type="text"
          name="q"
          autofocus
          value={query()}
          id="search"
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onPress(query);
            }
          }}
          placeholder="Search books..."
          class="w-full rounded-none border-0 px-10 py-6 m-1 focus-visible:ring-0 text-base	md:text-sm"
        />
      </TextField>
      <LoadingIcon />
    </form>
  );
}

function LoadingIcon() {
  const isPending = useIsRouting();

  return (
    <Show when={isPending()}>
      <div data-pending="" class="absolute right-3 top-1/2 -translate-y-1/2">
        <div
          class="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
          role="status"
        >
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </Show>
  );
}
