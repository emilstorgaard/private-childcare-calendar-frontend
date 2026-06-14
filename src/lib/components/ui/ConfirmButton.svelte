<script lang="ts">
  interface Props {
    onConfirm: () => void;
    message?: string;
    label?: string;
    variant?: 'danger' | 'secondary';
  }

  let {
    onConfirm,
    message = 'Er du sikker?',
    label = 'Slet',
    variant = 'danger'
  }: Props = $props();

  const styles = {
    danger: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-warm-200 text-warm-800 hover:bg-warm-300'
  };

  function handleClick() {
    if (confirm(message)) onConfirm();
  }
</script>

<button
  type="button"
  onclick={handleClick}
  class="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-3 py-1.5 text-sm min-h-9 transition-all active:scale-[0.97] cursor-pointer {styles[variant]}"
>
  {label}
</button>