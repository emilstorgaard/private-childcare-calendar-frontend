<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center py-24 text-center">
  <div class="text-6xl mb-4">⚠️</div>
  <h1 class="text-2xl font-bold text-warm-900 mb-2">{$page.error?.message}</h1>
  <a href="/" class="mt-6 text-brand-600 underline">Gå til forsiden</a>
</div>