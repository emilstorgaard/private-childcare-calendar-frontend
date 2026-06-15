<script lang="ts">
	import { PageHeader, Card } from '$lib/components/ui';
	import WaitingListForm from '$lib/components/forms/WaitingListForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Ret venteliste - Privat Pasning</title></svelte:head>

<PageHeader title="Ret venteliste" />
<div class="max-w-2xl">
	<Card><WaitingListForm entry={data.entry} /></Card>
</div>
