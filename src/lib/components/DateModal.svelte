<script lang="ts">
  import { goto } from '$app/navigation';
  import { formatDateLong } from '$lib/utils/dates';
  import { Modal } from '$lib/components/ui';

  interface Props {
    open: boolean;
    dateStr: string;
    onClose: () => void;
  }

  let { open, dateStr, onClose }: Props = $props();

  function navigate(path: string) {
    onClose();
    goto(`${path}?date=${dateStr}`);
  }

  const options = [
    { path: '/sygdom-fridage/opret', color: 'bg-[#7b1fa2]', label: 'Sygdom / fridag' },
    { path: '/ferie-lukkedage/opret', color: 'bg-[#263238]', label: 'Ferie / lukkedage' },
    { path: '/kalenderinfo/opret', color: 'bg-[#ef6c00]', label: 'Kalenderinfo' }
  ];
</script>

<Modal
  {open}
  {onClose}
  title="Opret på dato"
  subtitle={dateStr ? formatDateLong(dateStr) : ''}
>
  <div class="space-y-2">
    {#each options as opt}
      <button
        type="button"
        onclick={() => navigate(opt.path)}
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-warm-200 hover:bg-warm-50 transition-colors text-left cursor-pointer"
      >
        <span class="w-3 h-3 rounded-full {opt.color}"></span>
        <span class="font-medium text-warm-800">{opt.label}</span>
      </button>
    {/each}
  </div>
</Modal>