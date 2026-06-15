<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle?: string;
    actions?: Snippet;
  }

  let { title, subtitle, actions }: Props = $props();
</script>

<div class="flex flex-wrap items-start justify-between gap-3 mb-4 sm:mb-6">
  <div>
    <h1 class="text-xl sm:text-3xl font-bold text-warm-900 leading-tight">{title}</h1>
    {#if subtitle}
      <p class="text-sm sm:text-base text-warm-500 mt-0.5 sm:mt-1">{subtitle}</p>
    {/if}
  </div>
  {#if actions}
    <div class="flex gap-2">
      {@render actions()}
    </div>
  {/if}
</div>