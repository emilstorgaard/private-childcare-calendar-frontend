<script lang="ts">
  interface Props {
    type?: 'success' | 'error' | 'info';
    message: string;
  }

  let { type = 'success', message }: Props = $props();

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };
</script>

<div
  class="flex items-center gap-3 px-4 py-3 rounded-xl border font-medium mb-4 {styles[type]}"
  role={type === 'error' ? 'alert' : 'status'}
>
  <span class="flex-shrink-0 w-6 h-6 rounded-full bg-white/60 flex items-center justify-center text-sm font-bold">
    {icons[type]}
  </span>
  <span>{message}</span>
</div>