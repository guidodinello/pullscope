<script lang="ts">
  /**
   * Reusable error display component
   */
  let { message, onRetry, onDismiss } = $props<{
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
  }>();
</script>

{#if message}
  <div
    class="mb-4 border-l-4 border-red-500 bg-red-100 p-4 text-red-700"
    role="alert"
    aria-live="assertive"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="font-medium">Error</p>
        <p class="mt-1 text-sm">{message}</p>
      </div>
      <div class="ml-4 flex gap-2">
        {#if onRetry}
          <button
            class="rounded text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500"
            onclick={onRetry}
            aria-label="Retry action"
          >
            Try again
          </button>
        {/if}
        {#if onDismiss}
          <button
            class="rounded text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500"
            onclick={onDismiss}
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
