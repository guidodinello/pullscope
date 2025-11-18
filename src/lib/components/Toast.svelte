<script lang="ts">
  import { onMount } from "svelte";
  import { cn } from "../utils/cn";
  import { TOAST_TYPES, ToastType } from "../types/toast";
  import { TOAST_DURATION } from "../constants";

  let {
    message,
    duration = TOAST_DURATION.DEFAULT,
    type = TOAST_TYPES.INFO,
    onClose,
  }: {
    message: string;
    duration: number;
    type: ToastType;
    onClose?: () => void;
  } = $props();

  let visible = $state(true);

  onMount(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        visible = false;
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  });

  const handleClose = () => {
    visible = false;
    onClose?.();
  };

  const typeStyles = {
    info: "bg-info border-info-dark",
    success: "bg-success border-success-dark",
    error: "bg-error border-error-dark",
    warning: "bg-warning border-warning-dark",
  } as const satisfies Record<ToastType, string>;
</script>

{#if visible}
  <div
    class={cn(
      "animate-slide-in fixed bottom-4 right-4 z-50 max-w-md rounded-lg border-l-4 px-4 py-3 text-white shadow-lg",
      typeStyles[type]
    )}
    role="status"
    aria-live="polite"
  >
    <div class="flex items-center justify-between gap-3">
      <p class="flex-1 text-sm">{message}</p>
      <button
        class="rounded text-white transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white"
        onclick={handleClose}
        aria-label="Close notification"
      >
        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
{/if}

<style>
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
</style>
