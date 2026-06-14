<script lang="ts">
  import { page } from '$app/stores';
  import { PageHeader, Card } from '$lib/components/ui';
  import ClosureForm from '$lib/components/forms/ClosureForm.svelte';

  let defaultDate = $derived($page.url.searchParams.get('date') ?? undefined);
</script>

<svelte:head><title>Opret ferie/lukkedage - Privat Pasning</title></svelte:head>

<PageHeader title="Opret ferie/lukkedage" />
<div class="max-w-2xl">
  <Card><ClosureForm {defaultDate} /></Card>
</div>