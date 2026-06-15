<script lang="ts">
	import { PageHeader, Card } from '$lib/components/ui';
	import ChildForm from '$lib/components/forms/ChildForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Ret barn - Privat Pasning</title></svelte:head>

<PageHeader title="Ret barn" />
<div class="max-w-2xl">
	<Card><ChildForm child={data.child} /></Card>
</div>
