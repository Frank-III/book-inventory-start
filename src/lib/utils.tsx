import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const [timeoutId, setTimeoutId] = createSignal<number>();

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (timeoutId()) {
      clearTimeout(timeoutId());
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId as unknown as number);
  }) as T;

  onCleanup(() => {
    if (timeoutId()) {
      clearTimeout(timeoutId());
    }
  });

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

