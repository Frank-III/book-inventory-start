import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { TextField, TextFieldInput } from "~/components/ui/text-field";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Accessor,
  createSignal,
  For,
  JSX,
  Show,
  useTransition,
} from "solid-js";
import { useNavigate } from "@solidjs/router";

function filterAuthors(authors: string[], filterText: string) {
  return authors.filter((author) =>
    author.toLowerCase().includes(filterText.toLowerCase()),
  );
}

function createAuthorGroups(authors: string[]) {
  const groups: Record<string, string[]> = {};
  for (let i = 65; i <= 90; i++) {
    groups[String.fromCharCode(i)] = [];
  }
  groups["Other"] = [];

  authors.forEach((author) => {
    const firstLetter = author[0].toUpperCase();
    if (firstLetter >= "A" && firstLetter <= "Z") {
      groups[firstLetter].push(author);
    } else {
      groups["Other"].push(author);
    }
  });

  return groups;
}

interface SidebarProps {
  selectedAuthors: string[] | null;
  allAuthors: Accessor<string[] | undefined>;
}

export function Sidebar(props: SidebarProps) {
  const navigate = useNavigate();
  const [pending, start] = useTransition();

  const [selectedAuthors, setSelectedAuthors] = createSignal(
    (() => {
      if (!props.selectedAuthors) return [];
      return props.selectedAuthors;
    })(),
  );

  const [filterText, setFilterText] = createSignal("");

  const filteredAuthors = () => {
    const authorrs = props.allAuthors();
    return authorrs ? filterAuthors(authorrs, filterText()) : [];
  };
  const authorGroups = () => createAuthorGroups(filteredAuthors());

  const handleAuthorToggle = (author: string) => {
    if (!props.allAuthors) return;
    start(() => {
      const newAuthors = selectedAuthors().includes(author)
        ? selectedAuthors().filter((a) => a !== author)
        : [...selectedAuthors(), author];

      setSelectedAuthors(newAuthors.sort());

      const newParams = new URLSearchParams(
        newAuthors.map((author) => ["author", author]),
      );
      navigate(`/?${newParams}`);
    });
  };

  const handleClearAuthors = () => {
    start(() => {
      setSelectedAuthors([]);
      navigate("/");
    });
  };

  return (
    <div
      data-pending={pending() ? "" : undefined}
      class="w-[300px] flex-shrink-0 border-r flex flex-col h-full"
    >
      <div class="p-4 border-b">
        <h2 class="mb-2 text-lg font-semibold tracking-tight">Authors</h2>
        <div class="relative">
          <input
            type="text"
            placeholder="Filter authors..."
            value={filterText()}
            //@ts-ignore
            onChange={(e) => setFilterText(e.target.value)}
            class="pl-8"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width={1.5}
            stroke="currentColor"
            class="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
        </div>
      </div>
      {/* <ScrollArea className="flex-grow"> */}
      <div class="flex-grow">
        <div class="p-4">
          <For each={Object.entries(authorGroups())}>
            {([letter, authors]) => (
              <Show when={authors.length > 0 || !props.allAuthors}>
                <Collapsible>
                  <CollapsibleTrigger class="flex items-center justify-between w-full p-2 mb-1 text-left hover:bg-accent rounded-md">
                    <span>
                      {letter}
                      {props.allAuthors() && (
                        <span class="text-xs"> ({authors.length})</span>
                      )}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width={1.5}
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </CollapsibleTrigger>
                  <CollapsibleContent class="ml-2 space-y-1">
                    <For each={authors}>
                      {(author, index) => (
                        <div class="flex items-center space-x-2">
                          <Checkbox
                            id={author}
                            checked={selectedAuthors().includes(author)}
                            onChange={() => handleAuthorToggle(author)}
                          />
                          <label
                            for={author}
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {author}
                          </label>
                        </div>
                      )}
                    </For>
                  </CollapsibleContent>
                </Collapsible>
              </Show>
            )}
          </For>
        </div>
      </div>
      <Show
        when={(() => {
          const s = selectedAuthors();
          return props.allAuthors() && s.length > 0 && s;
        })()}
      >
        {(selectedAuthors) => (
          <div class="p-4 border-t">
            <div class="mb-2 text-sm font-medium">Selected Authors:</div>
            <div class="w-full whitespace-nowrap mb-2">
              <div class="flex space-x-2">
                <For each={selectedAuthors()}>
                  {(author, index) => (
                    <Button
                      variant="secondary"
                      size="sm"
                      class="flex items-center shrink-0"
                      onClick={() => handleAuthorToggle(author)}
                    >
                      {author}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width={1.5}
                        stroke="currentColor"
                        class="w-3 h-3 ml-1"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  )}
                </For>
              </div>
            </div>
            {/* <ScrollBar orientation="horizontal" /> */}
          </div>
        )}
      </Show>
      <Button variant="outline" class="w-full" onClick={handleClearAuthors}>
        Clear all filters
      </Button>
    </div>
  );
}
