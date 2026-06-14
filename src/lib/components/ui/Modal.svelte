<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    title?: string;
    subtitle?: string;
    onClose: () => void;
    children: Snippet;
  }

  let { open, title, subtitle, onClose, children }: Props = $props();

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/40 backdrop-blur-sm"
    onclick={handleBackdrop}
    role="presentation"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-[fadeIn_0.15s_ease-out]"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-start justify-between mb-5">
        <div>
          {#if title}
            <h2 class="text-lg font-bold text-warm-900">{title}</h2>
          {/if}
          {#if subtitle}
            <p class="text-sm text-warm-500 mt-0.5">{subtitle}</p>
          {/if}
        </div>
        <button
          type="button"
          onclick={onClose}
          aria-label="Luk"
          class="text-warm-400 hover:text-warm-700 text-2xl leading-none cursor-pointer transition-colors"
        >
          &times;
        </button>
      </div>
      {@render children()}
    </div>
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
</style>