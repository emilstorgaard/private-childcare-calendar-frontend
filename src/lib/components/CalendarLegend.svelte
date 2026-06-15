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

<div class="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-4 gap-y-2 mb-5 p-3 sm:p-0 bg-warm-50 sm:bg-transparent rounded-xl sm:rounded-none border border-warm-100 sm:border-0">
  {#each items as item}
    <span class="inline-flex items-center gap-2 text-xs sm:text-sm text-warm-600">
      <i class="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 rounded-full {item.color}"></i>
      {item.label}
    </span>
  {/each}
</div>