<script lang="ts">
	import { PageHeader, Card } from '$lib/components/ui';
	import ChildForm from '$lib/components/forms/ChildForm.svelte';
</script>

<svelte:head><title>Opret barn - Privat Pasning</title></svelte:head>

<PageHeader title="Opret barn" />
<div class="max-w-2xl">
	<Card><ChildForm /></Card>
</div>
