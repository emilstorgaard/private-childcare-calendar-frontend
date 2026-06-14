<script lang="ts">
  import { PageHeader, Card } from '$lib/components/ui';
  import ClosureForm from '$lib/components/forms/ClosureForm.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Ret ferie/lukkedage - Privat Pasning</title></svelte:head>

<PageHeader title="Ret ferie/lukkedage" />
<div class="max-w-2xl">
  <Card><ClosureForm closure={data.closure} /></Card>
</div>