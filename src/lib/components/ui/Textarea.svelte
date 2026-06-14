<script lang="ts">
  interface Props {
    id: string;
    value?: string;
    rows?: number;
    placeholder?: string;
  }

  let { id, value = $bindable(), rows = 4, placeholder }: Props = $props();
</script>

<textarea
  {id}
  {rows}
  {placeholder}
  bind:value
  class="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 bg-white text-warm-800 transition-colors resize-y focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
></textarea>