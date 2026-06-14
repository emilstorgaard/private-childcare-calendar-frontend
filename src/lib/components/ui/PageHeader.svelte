<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle?: string;
    actions?: Snippet;
  }

  let { title, subtitle, actions }: Props = $props();
</script>

<div class="flex flex-wrap items-center justify-between gap-4 mb-6">
  <div>
    <h1 class="text-2xl sm:text-3xl font-bold text-warm-900">{title}</h1>
    {#if subtitle}
      <p class="text-warm-500 mt-1">{subtitle}</p>
    {/if}
  </div>
  {#if actions}
    <div class="flex gap-2">
      {@render actions()}
    </div>
  {/if}
</div>