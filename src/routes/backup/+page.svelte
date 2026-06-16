<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { backupApi } from '$lib/api/backup';
	import {
		PageHeader,
		Card,
		Button,
		Alert,
		Table,
		TableRow,
		FormField,
		Input,
		ConfirmButton
	} from '$lib/components/ui';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let message = $state('');
	let error = $state('');
	let working = $state(false);
	let uploadFile = $state<FileList | null>(null);

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function formatDateTime(iso: string): string {
		return new Date(iso).toLocaleString('da-DK');
	}

	async function createBackup() {
		error = '';
		message = '';
		working = true;
		try {
			await backupApi.create();
			message = 'Backup er oprettet.';
			await invalidateAll();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Backup fejlede.';
		} finally {
			working = false;
		}
	}

	async function handleUpload(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		message = '';

		if (!uploadFile || uploadFile.length === 0) {
			error = 'Vælg først en backupfil.';
			return;
		}

		working = true;
		try {
			await backupApi.upload(uploadFile[0]);
			message = 'Backup er uploadet.';
			uploadFile = null;
			await invalidateAll();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Upload fejlede.';
		} finally {
			working = false;
		}
	}

	async function handleRestore(fileName: string) {
		error = '';
		message = '';
		working = true;
		try {
			const result = await backupApi.restore(fileName);
			message = result.message;
			await invalidateAll();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gendannelse fejlede.';
		} finally {
			working = false;
		}
	}

	async function handleDelete(fileName: string) {
		error = '';
		message = '';
		try {
			await backupApi.remove(fileName);
			message = 'Backupfilen er slettet.';
			await invalidateAll();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Sletning fejlede.';
		}
	}
</script>

<svelte:head><title>Backup - Privat Pasning</title></svelte:head>

<PageHeader title="Backup" subtitle="Sikkerhedskopiering og gendannelse" />

{#if message}<Alert type="success" {message} />{/if}
{#if error}<Alert type="error" message={error} />{/if}

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
	<Card>
		<h2 class="text-lg font-bold text-warm-900 mb-2 flex items-center gap-2">
			<span>💾</span> Opret backup
		</h2>
		<p class="text-warm-500 mb-4">Gem en sikkerhedskopi af hele databasen.</p>
		<Button onclick={createBackup} disabled={working}>
			{working ? 'Arbejder…' : 'Opret backup nu'}
		</Button>
	</Card>

	<Card>
		<h2 class="text-lg font-bold text-warm-900 mb-2 flex items-center gap-2">
			<span>📤</span> Upload backup
		</h2>
		<p class="text-warm-500 mb-4">Upload en backupfil fra din computer.</p>
		<form onsubmit={handleUpload}>
			<FormField label="Backupfil (.db)" forId="uploadFile">
				<Input id="uploadFile" type="file" accept=".db" bind:files={uploadFile} />
			</FormField>
			<Button variant="secondary" type="submit" disabled={working}>Upload backup</Button>
		</form>
	</Card>
</div>

<div>
	<h2 class="text-lg font-bold text-warm-900 mb-4 flex items-center gap-2">
		<span>📁</span> Eksisterende backups
	</h2>

	{#if data.backups.length === 0}
		<Card>
			<p class="text-warm-500 text-center py-4">Der er ingen backups endnu.</p>
		</Card>
	{:else}
		<Table headers={['Filnavn', 'Størrelse', 'Oprettet', '']}>
			{#each data.backups as backup}
				<TableRow
					cells={[
						{ label: 'Filnavn', value: backup.fileName },
						{ label: 'Størrelse', value: formatSize(backup.sizeBytes) },
						{ label: 'Oprettet', value: formatDateTime(backup.createdAt) }
					]}
				>
					{#snippet actions()}
						<Button variant="secondary" size="sm" href={backupApi.downloadUrl(backup.fileName)}>
							Download
						</Button>
						<ConfirmButton
							label="Gendan"
							variant="secondary"
							title="Bekræft gendannelse"
							confirmLabel="Ja, gendan"
							message="Gendan databasen fra denne backup? Alle nuværende data overskrives!"
							onConfirm={() => handleRestore(backup.fileName)}
							/>
						<ConfirmButton
							message="Slet backupfilen?"
							onConfirm={() => handleDelete(backup.fileName)}
						/>
					{/snippet}
				</TableRow>
			{/each}
		</Table>
	{/if}
</div>
