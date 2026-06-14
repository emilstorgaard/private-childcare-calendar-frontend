<script lang="ts">
  import { PageHeader, Card } from '$lib/components/ui';
  import NoteForm from '$lib/components/forms/NoteForm.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Ret kalenderinfo - Privat Pasning</title></svelte:head>

<PageHeader title="Ret kalenderinfo" />
<div class="max-w-2xl">
  <Card>
    <NoteForm note={data.note} />
  </Card>
</div>