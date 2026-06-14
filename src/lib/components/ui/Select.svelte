<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id: string;
    value?: string | number;
    required?: boolean;
    children: Snippet;
  }

  let { id, value = $bindable(), required = false, children }: Props = $props();
</script>

<select
  {id}
  {required}
  bind:value
  class="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 bg-white text-warm-800 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none cursor-pointer"
>
  {@render children()}
</select>