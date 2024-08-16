import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { leading, debounce } from "@solid-primitives/scheduled";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) {
  const debouncedCallback = debounce(callback, delay);

  return debouncedCallback;
}

export function useDebounce<T>(value: Accessor<T>, delay: number): () => T {
  const [debouncedValue, setDebouncedValue] = createSignal<T>(value());

  createEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    onCleanup(() => {
      clearTimeout(timeoutId);
    });
  });

  return debouncedValue;
}
