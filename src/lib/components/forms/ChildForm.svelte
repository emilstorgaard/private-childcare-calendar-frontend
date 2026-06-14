<script lang="ts">
  import { goto } from '$app/navigation';
  import { childrenApi } from '$lib/api/children';
  import { ApiError } from '$lib/api/client';
  import { toInputDate, today } from '$lib/utils/dates';
  import { FormField, Input, Textarea, Button, Alert } from '$lib/components/ui';
  import type { Child, ChildRequest } from '$lib/types';

  interface Props {
    child?: Child;
  }

  let { child }: Props = $props();

  function defaultEndDate(): string {
    const t = new Date();
    return `${t.getFullYear() + 3}-${String(t.getMonth() + 1).padStart(2, '0')}-01`;
  }

  let name = $state(child?.name ?? '');
  let birthDate = $state(child ? toInputDate(child.birthDate) : today());
  let startDate = $state(child ? toInputDate(child.startDate) : today());
  let endDate = $state(child ? toInputDate(child.endDate) : defaultEndDate());
  let noteText = $state(child?.note ?? '');

  let error = $state('');
  let saving = $state(false);
  const isEdit = !!child;

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    saving = true;

    const payload: ChildRequest = { name, birthDate, startDate, endDate, note: noteText || null };

    try {
      if (isEdit && child) {
        await childrenApi.update(child.id, payload);
      } else {
        await childrenApi.create(payload);
      }
      await goto('/boern');
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Der opstod en uventet fejl.';
      saving = false;
    }
  }
</script>

<form onsubmit={handleSubmit}>
  {#if error}<Alert type="error" message={error} />{/if}

  <FormField label="Barnets navn" forId="name">
    <Input id="name" bind:value={name} required />
  </FormField>

  <FormField label="Fødselsdato" forId="birthDate">
    <Input id="birthDate" type="date" bind:value={birthDate} required />
  </FormField>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <FormField label="Pasningsstart" forId="startDate">
      <Input id="startDate" type="date" bind:value={startDate} required />
    </FormField>
    <FormField label="Slutdato" forId="endDate" hint="Som standard 3 år efter fødsel.">
      <Input id="endDate" type="date" bind:value={endDate} required />
    </FormField>
  </div>

  <FormField label="Bemærkning" forId="note">
    <Textarea id="note" bind:value={noteText} />
  </FormField>

  <div class="flex flex-wrap gap-3 mt-6">
    <Button type="submit" disabled={saving}>{saving ? 'Gemmer…' : 'Gem'}</Button>
    <Button variant="secondary" href="/boern">Tilbage</Button>
  </div>
</form>