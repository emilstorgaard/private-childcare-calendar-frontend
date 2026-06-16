<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle?: string;
    actions?: Snippet;
    variant?: 'page' | 'section';
  }

  let { title, subtitle, actions, variant = 'page' }: Props = $props();
</script>

<div class="flex flex-wrap items-start justify-between gap-3 {variant === 'page' ? 'mb-4 sm:mb-6' : 'mt-8 mb-3'}">
  <div>
    {#if variant === 'page'}
      <h1 class="text-xl sm:text-3xl font-bold text-warm-900 leading-tight">{title}</h1>
    {:else}
      <h2 class="text-base sm:text-lg font-semibold text-warm-700 leading-tight">{title}</h2>
    {/if}
    {#if subtitle}
      <p class="text-sm {variant === 'page' ? 'sm:text-base text-warm-500 mt-0.5 sm:mt-1' : 'text-warm-400 mt-0.5'}">{subtitle}</p>
    {/if}
  </div>
  {#if actions}
    <div class="flex gap-2">
      {@render actions()}
    </div>
  {/if}
</div>