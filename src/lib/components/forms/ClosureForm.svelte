<script lang="ts">
  import { goto } from '$app/navigation';
  import { closuresApi } from '$lib/api/closures';
  import { ApiError } from '$lib/api/client';
  import { toInputDate, today } from '$lib/utils/dates';
  import { ClosurePeriodType, closurePeriodLabels } from '$lib/types';
  import { FormField, Input, Textarea, Select, Button, Alert } from '$lib/components/ui';
  import type { ClosurePeriod, ClosurePeriodRequest } from '$lib/types';

  interface Props {
    closure?: ClosurePeriod;
    defaultDate?: string;
  }

  let { closure, defaultDate }: Props = $props();

  let title = $state(closure?.title ?? 'Ferie/lukket');
  let startDate = $state(closure ? toInputDate(closure.startDate) : (defaultDate ?? today()));
  let endDate = $state(closure ? toInputDate(closure.endDate) : (defaultDate ?? today()));
  let periodType = $state<ClosurePeriodType>(closure?.periodType ?? ClosurePeriodType.Ferie);
  let noteText = $state(closure?.note ?? '');

  let error = $state('');
  let saving = $state(false);
  const isEdit = !!closure;

  const typeOptions = Object.entries(closurePeriodLabels).map(([value, label]) => ({
    value: Number(value) as ClosurePeriodType,
    label
  }));

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    saving = true;

    const payload: ClosurePeriodRequest = { title, startDate, endDate, periodType, note: noteText || null };

    try {
      if (isEdit && closure) {
        await closuresApi.update(closure.id, payload);
      } else {
        await closuresApi.create(payload);
      }
      await goto('/ferie-lukkedage');
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Der opstod en uventet fejl.';
      saving = false;
    }
  }
</script>

<form onsubmit={handleSubmit}>
  {#if error}<Alert type="error" message={error} />{/if}

  <FormField label="Overskrift" forId="title">
    <Input id="title" bind:value={title} required />
  </FormField>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <FormField label="Fra dato" forId="startDate">
      <Input id="startDate" type="date" bind:value={startDate} required />
    </FormField>
    <FormField label="Til dato" forId="endDate">
      <Input id="endDate" type="date" bind:value={endDate} required />
    </FormField>
  </div>

  <FormField label="Type" forId="periodType">
    <Select id="periodType" bind:value={periodType}>
      {#each typeOptions as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </Select>
  </FormField>

  <FormField label="Bemærkning" forId="note">
    <Textarea id="note" bind:value={noteText} />
  </FormField>

  <div class="flex flex-wrap gap-3 mt-6">
    <Button type="submit" disabled={saving}>{saving ? 'Gemmer…' : 'Gem'}</Button>
    <Button variant="secondary" href="/ferie-lukkedage">Tilbage</Button>
  </div>
</form>