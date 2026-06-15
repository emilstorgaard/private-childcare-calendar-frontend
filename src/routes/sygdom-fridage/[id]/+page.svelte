<script lang="ts">
	import { PageHeader, Card } from '$lib/components/ui';
	import DayStatusForm from '$lib/components/forms/DayStatusForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Ret sygdom/fridag - Privat Pasning</title></svelte:head>

<PageHeader title="Ret sygdom/fridag" />
<div class="max-w-2xl">
	<Card><DayStatusForm status={data.status} children={data.children} /></Card>
</div>
