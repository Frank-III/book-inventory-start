import { createSignal, Show } from 'solid-js';
import { TextField, TextFieldInput, TextFieldLabel } from '~/components/ui/text-field';
import {useDebounceCallback} from '~/lib/utils';
import { action,  reload,  useAction,  useSearchParams,  useSubmission } from '@solidjs/router';


// TODO: I don't know what to do with this code yet.
const formAction = action(async (formData) => {
  const [searchParams, setSearchParms] = useSearchParams();
  setSearchParms({q: formData.q});
})

export function Search(props: { query: string }) {

  const [formRef, setFormRef] = createSignal<HTMLFormElement | null>(null);
  const [query, setQuery] = createSignal(props.query);
  const actionFn = useAction(formAction);

  const debounceSearch = useDebounceCallback(() => {
    if (formRef()) actionFn({q: query()})
  }, 200);

  debounceSearch();

  return (
    <form
      ref={setFormRef}
      action={formAction}
      class="relative flex flex-1 flex-shrink-0 w-full"
    >
      <label for="search" class="sr-only">
        Search
      </label>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <TextField>
      {/* FIX: hmmmm this is hard */}
      <TextFieldInput
        onChange={setQuery}
        // onInput={setQuery}
        type="text"
        name="q"
        autofocus
        value={query()}
        id="search"
        placeholder="Search books..."
        class="w-full rounded-none border-0 px-10 py-6 m-1 focus-visible:ring-0 text-base	md:text-sm"
      />
      </TextField>
      <LoadingIcon />
    </form>
  );
}

function LoadingIcon() {
  const actionStatus = useSubmission(formAction);

  return (<Show when={actionStatus.pending}>
    <div
      data-pending=''
      class="absolute right-3 top-1/2 -translate-y-1/2"
    >
      <div
        class="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </Show>)
}