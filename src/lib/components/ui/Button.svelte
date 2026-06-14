<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md';
    type?: 'button' | 'submit';
    href?: string;
    disabled?: boolean;
    onclick?: () => void;
    children: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    type = 'button',
    href,
    disabled = false,
    onclick,
    children
  }: Props = $props();

  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';

  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm hover:shadow',
    secondary: 'bg-warm-200 text-warm-800 hover:bg-warm-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    ghost: 'bg-transparent text-warm-700 hover:bg-warm-200'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-9',
    md: 'px-4 py-2.5 text-sm min-h-11'
  };

  let classes = $derived(`${base} ${variants[variant]} ${sizes[size]}`);
</script>

{#if href}
  <a {href} class={classes}>
    {@render children()}
  </a>
{:else}
  <button {type} {disabled} {onclick} class={classes}>
    {@render children()}
  </button>
{/if}