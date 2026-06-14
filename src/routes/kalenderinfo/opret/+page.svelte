<script lang="ts">
  import { page } from '$app/stores';
  import { PageHeader, Card } from '$lib/components/ui';
  import NoteForm from '$lib/components/forms/NoteForm.svelte';

  let defaultDate = $derived($page.url.searchParams.get('date') ?? undefined);
</script>

<svelte:head><title>Opret kalenderinfo - Privat Pasning</title></svelte:head>

<PageHeader title="Opret kalenderinfo" />
<div class="max-w-2xl">
  <Card>
    <NoteForm {defaultDate} />
  </Card>
</div>