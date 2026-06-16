<script lang="ts">
  import { Modal, Button } from '$lib/components/ui';

  interface Props {
    onConfirm: () => void;
    message?: string;
    label?: string;
    title?: string;
    confirmLabel?: string;
    variant?: 'danger' | 'secondary';
  }

  let {
    onConfirm,
    message = 'Er du sikker?',
    label = 'Slet',
    title = 'Bekræft sletning',
    confirmLabel = '🗑️ Ja, slet',
    variant = 'danger'
  }: Props = $props();

  const styles = {
    danger: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-warm-200 text-warm-800 hover:bg-warm-300'
  };

  let modalOpen = $state(false);
</script>

<button
  type="button"
  onclick={() => (modalOpen = true)}
  class="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-3 py-1.5 text-sm min-h-9 transition-all active:scale-[0.97] cursor-pointer {styles[variant]}"
>
  {label}
</button>

<Modal
  open={modalOpen}
  {title}
  onClose={() => (modalOpen = false)}
>
  <p class="text-warm-700 mb-6">{message}</p>
  <div class="flex flex-wrap gap-2">
    <Button variant="danger" onclick={() => { modalOpen = false; onConfirm(); }}>
      {confirmLabel}
    </Button>
    <Button variant="secondary" onclick={() => (modalOpen = false)}>
      Annuller
    </Button>
  </div>
</Modal>