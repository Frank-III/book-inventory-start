import { fetchBookById } from "~/api/server";
import { Photo } from "~/components/photo";
import {
  A,
  cache,
  createAsync,
  RouteDefinition,
  useNavigate,
  useParams,
} from "@solidjs/router";
import { For, Show } from "solid-js";

function BackButton() {
  let navigate = useNavigate();

  return (
    // <A
    //   class="p-3 mb-8 mr-auto rounded hover:bg-gray-100"
    //   href="/"
    //   replace={true}
    // >
    //   ← Back to all books
    // </A>
    <button
      onClick={() => {
        console.log("clicked");
        window.history.back();
        // navigate("/", { replace: true });
      }}
      class="p-3 mb-8 mr-auto rounded hover:bg-gray-100"
    >
      ← Back to all books
    </button>
  );
}

function StarRating(props: { rating: number | null }) {
  if (props.rating === null) return null;

  return (
    <div class="flex">
      <For each={[...Array(5)]}>{(_, index) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width={1.5}
          stroke="currentColor"
          class={`w-6 h-6 ${
            index() < Math.floor(props.rating!)
              ? "text-yellow-400 fill-current"
              : index() < Math.ceil(props.rating!)
                ? "text-yellow-400 fill-current half-star"
                : "text-gray-300"
          }`}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>)}
      </For>
    </div>
  );
}

const fetchBook = cache((id) => fetchBookById(id), "book")

export const route = {
  load({ params }) {
    return fetchBook(params.id);
  },
} satisfies RouteDefinition;

export default function Page() {
  const params = useParams();
  const book = createAsync(() => fetchBookById(params.id));

  return (
    // <ScrollArea class="p-4"></div>
    <div class="p-4">
      <div class="flex flex-col items-center w-full">
        <BackButton />
        <Show when={book()} fallback={<div>Not Book found</div>}>
          {(book) => (
            <div class="flex flex-col w-full md:flex-row">
              <div class="w-1/4 mr-6 flex-none relative aspect-[2/3] mb-6">
                <Photo src={book().image ?? ""} title={book().title} />
              </div>
              <div>
                <div class="mb-2 text-2xl md:text-5xl font-bold">
                  {book().title}
                </div>
                <div class="mb-4 text-lg">{book().author}</div>
                <StarRating rating={book().rating} />
                <div class="mt-4 opacity-80">{book().description}</div>
              </div>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}
