<script lang="ts">
  import { onMount } from "svelte";

  /**
   * Toast notification component with auto-dismiss
   */
  let {
    message,
    duration = 3000,
    type = "info",
    onClose,
  } = $props<{
    message: string;
    duration?: number;
    type?: "info" | "success" | "error" | "warning";
    onClose?: () => void;
  }>();

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

  function handleClose() {
    visible = false;
    onClose?.();
  }

  const typeStyles: Record<typeof type, string> = {
    info: "bg-blue-600 border-blue-700",
    success: "bg-green-600 border-green-700",
    error: "bg-red-600 border-red-700",
    warning: "bg-yellow-600 border-yellow-700",
  };
</script>

{#if visible}
  <div
    class="fixed bottom-4 right-4 {typeStyles[
      type
    ]} animate-slide-in z-50 max-w-md rounded-lg border-l-4 px-4 py-3 text-white shadow-lg"
    role="status"
    aria-live="polite"
  >
    <div class="flex items-center justify-between gap-3">
      <p class="flex-1 text-sm">{message}</p>
      <button
        class="rounded text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
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
