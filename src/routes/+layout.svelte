<script lang="ts">
  import '../app.css';
  import { page, navigating } from '$app/stores'; // ✅ tilføj navigating

  let { children } = $props();
  let navOpen = $state(false);

  const navItems = [
    { href: '/', label: 'Kalender', icon: '📅' },
    { href: '/overblik', label: 'Overblik', icon: '📊' },
    { href: '/boern', label: 'Børn', icon: '👶' },
    { href: '/venteliste', label: 'Venteliste', icon: '📋' },
    { href: '/sygdom-fridage', label: 'Sygdom/fridage', icon: '🏥' },
    { href: '/ferie-lukkedage', label: 'Ferie/lukkedage', icon: '🏖️' },
    { href: '/kalenderinfo', label: 'Kalenderinfo', icon: '📝' },
    { href: '/setup', label: 'Setup', icon: '⚙️' },
    { href: '/backup', label: 'Backup', icon: '💾' }
  ];

  function isActive(href: string): boolean {
    const path = $page.url.pathname;
    if (href === '/') return path === '/';
    return path === href || path.startsWith(href + '/');
  }
</script>

<div class="min-h-screen flex flex-col">
  <!-- Topbar -->
  <header class="sticky top-0 z-40 bg-brand-600 text-white shadow-md">

    <!-- ✅ Loading-bar øverst i headeren -->
    {#if $navigating}
      <div class="absolute top-0 left-0 right-0 h-1 bg-white/30 overflow-hidden">
        <div class="h-full bg-white animate-[loading_1s_ease-in-out_infinite]"></div>
      </div>
    {/if}

    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <a href="/" class="group flex items-center shrink-0">
          <img
            src="/logo-elines-krudtugler.png"
            alt="Elines Krudtugler"
            fetchpriority="high"
            loading="eager"
            decoding="async"
            width="96"
            height="96"
            class="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        <!-- Desktop nav -->
        <nav class="hidden lg:flex items-center gap-1">
          {#each navItems as item}
            <a
              href={item.href}
              class="px-3 py-2 rounded-lg text-sm font-medium transition-colors {isActive(item.href)
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-white/10'}"
            >
              {item.label}
            </a>
          {/each}
        </nav>

        <!-- Hamburger -->
        <button
          class="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Menu"
          onclick={() => (navOpen = !navOpen)}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if navOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobil nav -->
    {#if navOpen}
      <nav class="lg:hidden border-t border-white/15 bg-brand-600 px-4 py-3 space-y-1">
        {#each navItems as item}
          <a
            href={item.href}
            onclick={() => (navOpen = false)}
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors {isActive(item.href)
              ? 'bg-white/20'
              : 'hover:bg-white/10'}"
          >
            <span>{item.icon}</span>
            {item.label}
          </a>
        {/each}
      </nav>
    {/if}
  </header>

  <!-- Indhold -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="border-t border-warm-200 py-4 text-center text-sm text-warm-400">
    Elines Krudtugler – Kalender
  </footer>
</div>

<!-- ✅ Tilføj animation i app.css i stedet hvis du foretrækker det -->
<style>
  @keyframes loading {
    0%   { transform: translateX(-100%); width: 40%; }
    50%  { width: 60%; }
    100% { transform: translateX(250%); width: 40%; }
  }
</style>