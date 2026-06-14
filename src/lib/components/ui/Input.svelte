<script lang="ts">
  interface Props {
    id: string;
    type?: 'text' | 'date' | 'number' | 'tel' | 'file';
    value?: string | number;
    files?: FileList | null;
    required?: boolean;
    min?: string | number;
    max?: string | number;
    accept?: string;
    placeholder?: string;
    autocomplete?: 'on' | 'off';
  }

  let {
    id,
    type = 'text',
    value = $bindable(),
    files = $bindable(),
    required = false,
    min,
    max,
    accept,
    placeholder,
    autocomplete = 'off'
  }: Props = $props();

  const baseClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-warm-300 bg-white text-warm-800 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none';
</script>

{#if type === 'file'}
  <input {id} type="file" {accept} bind:files class="{baseClass} file:mr-3 file:px-3 file:py-1 file:rounded-lg file:border-0 file:bg-brand-100 file:text-brand-700 file:font-medium file:cursor-pointer" />
{:else}
  <input
    {id}
    {type}
    {required}
    {min}
    {max}
    {placeholder}
    {autocomplete}
    bind:value
    class={baseClass}
  />
{/if}