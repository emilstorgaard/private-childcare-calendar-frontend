<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    class?: string;
  }

  let { children, class: extraClass = '' }: Props = $props();
</script>

<div class="bg-white rounded-2xl shadow-sm border border-warm-200 p-5 sm:p-6 {extraClass}">
  {@render children()}
</div>