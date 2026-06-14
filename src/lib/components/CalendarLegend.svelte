<script lang="ts">
  const items = [
    { color: 'bg-[#1565c0]', label: 'Barn i pasning' },
    { color: 'bg-[#2e7d32]', label: 'Barn starter' },
    { color: 'bg-[#c62828]', label: 'Plads ledig' },
    { color: 'bg-white border-2 border-[#d32f2f]', label: 'Fødselsdag' },
    { color: 'bg-[#7b1fa2]', label: 'Syg' },
    { color: 'bg-[#757575]', label: 'Fridag' },
    { color: 'bg-[#ef6c00]', label: 'Kalenderinfo' },
    { color: 'bg-[#f9a825]', label: 'Venteliste' },
    { color: 'bg-[#d7ede0] border border-[#1d4d31]', label: 'Dansk helligdag' },
    { color: 'bg-[#263238]', label: 'Ferie/lukket' }
  ];
</script>

<div class="flex flex-wrap gap-x-4 gap-y-2 mb-5">
  {#each items as item}
    <span class="inline-flex items-center gap-2 text-sm text-warm-600">
      <i class="w-3 h-3 rounded-full {item.color}"></i>
      {item.label}
    </span>
  {/each}
</div>