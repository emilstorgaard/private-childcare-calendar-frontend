<script lang="ts">
  import { goto } from '$app/navigation';
  import { dayStatusApi } from '$lib/api/daystatus';
  import { ApiError } from '$lib/api/client';
  import { toInputDate, today } from '$lib/utils/dates';
  import { ChildDayStatusType, childDayStatusLabels } from '$lib/types';
  import { FormField, Input, Textarea, Select, Button, Alert } from '$lib/components/ui';
  import type { DayStatus, DayStatusRequest, Child } from '$lib/types';

  interface Props {
    status?: DayStatus;
    children: Child[];
    defaultDate?: string;
  }

  let { status, children, defaultDate }: Props = $props();

  let childId = $state<number | ''>(status?.childId ?? '');
  let date = $state(status ? toInputDate(status.date) : (defaultDate ?? today()));
  let endDate = $state(status ? toInputDate(status.endDate) : (defaultDate ?? today()));
  let statusType = $state<ChildDayStatusType>(status?.statusType ?? ChildDayStatusType.Syg);
  let noteText = $state(status?.note ?? '');

  let error = $state('');
  let saving = $state(false);
  const isEdit = !!status;

  const typeOptions = Object.entries(childDayStatusLabels).map(([value, label]) => ({
    value: Number(value) as ChildDayStatusType,
    label
  }));

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';

    if (childId === '') {
      error = 'Vælg et barn.';
      return;
    }
    saving = true;

    const payload: DayStatusRequest = {
      childId: Number(childId),
      date,
      endDate,
      statusType,
      note: noteText || null
    };

    try {
      if (isEdit && status) {
        await dayStatusApi.update(status.id, payload);
      } else {
        await dayStatusApi.create(payload);
      }
      await goto('/sygdom-fridage');
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Der opstod en uventet fejl.';
      saving = false;
    }
  }
</script>

<form onsubmit={handleSubmit}>
  {#if error}<Alert type="error" message={error} />{/if}

  <FormField label="Barn" forId="childId">
    <Select id="childId" bind:value={childId} required>
      <option value="">— Vælg barn —</option>
      {#each children as child}
        <option value={child.id}>{child.name}</option>
      {/each}
    </Select>
  </FormField>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <FormField label="Fra dato" forId="date">
      <Input id="date" type="date" bind:value={date} required />
    </FormField>
    <FormField label="Til dato" forId="endDate" hint="Sæt samme dato hvis det kun gælder én dag.">
      <Input id="endDate" type="date" bind:value={endDate} required />
    </FormField>
  </div>

  <FormField label="Type" forId="statusType">
    <Select id="statusType" bind:value={statusType}>
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
    <Button variant="secondary" href="/sygdom-fridage">Tilbage</Button>
  </div>
</form>