<script lang="ts">
	import { page } from '$app/stores';
	import { PageHeader, Card } from '$lib/components/ui';
	import WaitingListForm from '$lib/components/forms/WaitingListForm.svelte';

	let defaultDate = $derived($page.url.searchParams.get('date') ?? undefined);
</script>

<svelte:head><title>Opret på venteliste - Privat Pasning</title></svelte:head>

<PageHeader title="Opret på venteliste" />
<div class="max-w-2xl">
	<Card><WaitingListForm {defaultDate} /></Card>
</div>
