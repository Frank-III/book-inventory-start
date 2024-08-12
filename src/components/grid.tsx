import { books } from '@/schema';
import { Photo } from './photo';
import { Accessor, For } from 'solid-js';
import { A } from '@solidjs/router';

type SelectBook = typeof books.$inferSelect;

export function BooksGrid(props: {books: Accessor<SelectBook[] | undefined>}) {
  return (
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <For each={props.books()} fallback={
        <p class="text-center text-muted-foreground col-span-full">
          No books found.
        </p>
      }>
        {(book) => (
          <A href={`/${book.id}`} class="block transition ease-in-out md:hover:scale-105">
            <Photo src={book.image!} title={book.title} />
          </A>
        )
        }
      </For>
    </div>
  );
}