<script lang="ts">
  interface Props {
    type?: 'success' | 'error';
    message: string;
  }

  let { type = 'success', message }: Props = $props();
</script>

{#if type === 'success'}
  <div class="alert success" role="status">{message}</div>
{:else}
  <div class="validation-summary" role="alert">{message}</div>
{/if}