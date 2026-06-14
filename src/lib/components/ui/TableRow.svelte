<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    cells: { label: string; value: string }[];
    actions?: Snippet;
  }

  let { cells, actions }: Props = $props();
</script>

<!-- Desktop række -->
<tr class="hidden sm:table-row hover:bg-warm-50 transition-colors">
  {#each cells as cell}
    <td class="px-4 py-3 text-warm-700">{cell.value}</td>
  {/each}
  {#if actions}
    <td class="px-4 py-3">
      <div class="flex flex-wrap gap-2 justify-end">
        {@render actions()}
      </div>
    </td>
  {/if}
</tr>

<!-- Mobil kort -->
<div class="sm:hidden bg-white rounded-2xl border border-warm-200 shadow-sm p-4 space-y-2">
  {#each cells as cell}
    <div class="flex justify-between gap-3 text-sm">
      <span class="font-semibold text-warm-500">{cell.label}</span>
      <span class="text-warm-800 text-right">{cell.value}</span>
    </div>
  {/each}
  {#if actions}
    <div class="flex flex-wrap gap-2 justify-end pt-2 border-t border-warm-100">
      {@render actions()}
    </div>
  {/if}
</div>