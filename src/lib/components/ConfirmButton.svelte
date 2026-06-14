<script lang="ts">
  interface Props {
    onConfirm: () => void;
    message?: string;
    label?: string;
  }

  let { onConfirm, message = 'Er du sikker?', label = 'Slet' }: Props = $props();

  function handleClick() {
    if (confirm(message)) {
      onConfirm();
    }
  }
</script>

<button class="btn danger btn-sm" type="button" onclick={handleClick}>
  {label}
</button>