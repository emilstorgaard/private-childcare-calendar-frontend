<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    message: string;
    icon?: string;
    action?: Snippet;
  }

  let { message, icon = '📋', action }: Props = $props();
</script>

<div class="bg-white rounded-2xl border-2 border-dashed border-warm-300 px-6 py-12 text-center">
  <div class="text-4xl mb-3">{icon}</div>
  <p class="text-warm-500 mb-5">{message}</p>
  {#if action}
    {@render action()}
  {/if}
</div>