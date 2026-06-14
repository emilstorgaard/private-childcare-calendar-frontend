<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label: string;
    forId: string;
    hint?: string;
    children: Snippet;
  }

  let { label, forId, hint, children }: Props = $props();
</script>

<div class="mb-4">
  <label for={forId} class="block font-semibold text-warm-800 mb-1.5">
    {label}
  </label>
  {@render children()}
  {#if hint}
    <p class="text-sm text-warm-500 mt-1">{hint}</p>
  {/if}
</div>