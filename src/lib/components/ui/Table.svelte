<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    headers: string[];
    children: Snippet;
  }

  let { headers, children }: Props = $props();
</script>

<div class="hidden sm:block overflow-x-auto rounded-2xl border border-warm-200 bg-white shadow-sm">
  <table class="w-full">
    <thead>
      <tr class="border-b border-warm-200 bg-brand-50">
        {#each headers as header}
          <th class="px-4 py-3 text-left text-sm font-semibold text-warm-700">
            {header}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="divide-y divide-warm-100">
      {@render children()}
    </tbody>
  </table>
</div>

<div class="sm:hidden space-y-3">
  {@render children()}
</div>