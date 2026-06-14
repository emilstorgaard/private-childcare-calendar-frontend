<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    color?: 'blue' | 'green' | 'red' | 'purple' | 'gray' | 'orange' | 'yellow';
    children: Snippet;
  }

  let { color = 'gray', children }: Props = $props();

  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-warm-200 text-warm-700',
    orange: 'bg-orange-100 text-orange-700',
    yellow: 'bg-amber-100 text-amber-700'
  };
</script>

<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold {colors[color]}">
  {@render children()}
</span>