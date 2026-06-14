<script lang="ts">
  import { settingsApi } from '$lib/api/settings';
  import { ApiError } from '$lib/api/client';
  import { PageHeader, Card, FormField, Input, Button, Alert } from '$lib/components/ui';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let maxChildren = $state(data.settings.maxChildren);
  let saved = $state(false);
  let error = $state('');
  let saving = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    saved = false;
    saving = true;

    try {
      await settingsApi.update({ maxChildren });
      saved = true;
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Der opstod en uventet fejl.';
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head><title>Setup - Privat Pasning</title></svelte:head>

<PageHeader title="Setup" subtitle="Indstillinger for din pasning" />

<div class="max-w-2xl">
  {#if saved}
    <Alert type="success" message="Setup er gemt." />
  {/if}

  <Card>
    <form onsubmit={handleSubmit}>
      {#if error}<Alert type="error" message={error} />{/if}

      <FormField
        label="Maks antal børn på samme tid"
        forId="maxChildren"
        hint="Bruges til at kontrollere, om pasningsperioder overlapper og overstiger det tilladte antal børn."
      >
        <Input
          id="maxChildren"
          type="number"
          bind:value={maxChildren}
          min={1}
          max={20}
          required
        />
      </FormField>

      <div class="mt-6">
        <Button type="submit" disabled={saving}>
          {saving ? 'Gemmer…' : 'Gem setup'}
        </Button>
      </div>
    </form>
  </Card>
</div>