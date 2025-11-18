<script lang="ts">
  let {
    message,
    onRetry,
    onDismiss,
  }: {
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
  } = $props();

  const errorButtonClasses =
    "focus:ring-error rounded text-sm underline transition-opacity hover:no-underline hover:opacity-80 focus:outline-none focus:ring-2";
</script>

{#if message}
  <div
    class="border-error bg-error-light text-error-dark mb-4 border-l-4 p-4"
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
          <button class={errorButtonClasses} onclick={onRetry} aria-label="Retry action">
            Try again
          </button>
        {/if}
        {#if onDismiss}
          <button class={errorButtonClasses} onclick={onDismiss} aria-label="Dismiss error">
            Dismiss
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
