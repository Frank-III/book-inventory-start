import { Params } from "@solidjs/router";
import { JSX } from "solid-js";
import { cn } from "~/lib/utils";

export interface RouteSectionProps<T = unknown, TSlots extends string = never> {
  params: Params;
  location: Location;
  data: T;
  children?: JSX.Element;
  slots: Record<TSlots, JSX.Element>;
}
const Page = (props: RouteSectionProps<never, "sidebar" | "search">) => {
  return (
    <main
      class={cn(
        "min-h-[calc(100dvh)] bg-white font-sans antialiased dark:bg-black dark:text-white",
      )}
    >
      <div class="group flex h-[calc(100dvh)] w-full overflow-hidden">
        <div class="hidden md:block">{props.slots.sidebar}</div>
        <div class="flex flex-1 flex-col">
          <div class="border-b">{props.slots.search}</div>
          <div class="flex-1 flex flex-col overflow-hidden">
            {props.children}
          </div>
        </div>
      </div>
    </main>
  );
};
