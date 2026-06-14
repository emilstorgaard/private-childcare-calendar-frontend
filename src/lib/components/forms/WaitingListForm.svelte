<script lang="ts">
  import { goto } from '$app/navigation';
  import { waitingListApi } from '$lib/api/waitinglist';
  import { ApiError } from '$lib/api/client';
  import { toInputDate } from '$lib/utils/dates';
  import { FormField, Input, Textarea, Button, Alert } from '$lib/components/ui';
  import type { WaitingListEntry, WaitingListRequest } from '$lib/types';

  interface Props {
    entry?: WaitingListEntry;
    defaultDate?: string;
  }

  let { entry, defaultDate }: Props = $props();

  let childName = $state(entry?.childName ?? '');
  let contactName = $state(entry?.contactName ?? '');
  let phone = $state(entry?.phone ?? '');
  let wantedStartDate = $state(
    entry?.wantedStartDate ? toInputDate(entry.wantedStartDate) : (defaultDate ?? '')
  );
  let noteText = $state(entry?.note ?? '');

  let error = $state('');
  let saving = $state(false);
  const isEdit = !!entry;

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    saving = true;

    const payload: WaitingListRequest = {
      childName,
      contactName: contactName || null,
      phone: phone || null,
      wantedStartDate: wantedStartDate || null,
      note: noteText || null
    };

    try {
      if (isEdit && entry) {
        await waitingListApi.update(entry.id, payload);
      } else {
        await waitingListApi.create(payload);
      }
      await goto('/venteliste');
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Der opstod en uventet fejl.';
      saving = false;
    }
  }
</script>

<form onsubmit={handleSubmit}>
  {#if error}<Alert type="error" message={error} />{/if}

  <FormField label="Barnets navn" forId="childName">
    <Input id="childName" bind:value={childName} required />
  </FormField>

  <FormField label="Forælder/kontakt" forId="contactName">
    <Input id="contactName" bind:value={contactName} />
  </FormField>

  <FormField label="Telefon" forId="phone">
    <Input id="phone" type="tel" bind:value={phone} />
  </FormField>

  <FormField label="Ønsket startdato" forId="wantedStartDate">
    <Input id="wantedStartDate" type="date" bind:value={wantedStartDate} />
  </FormField>

  <FormField label="Bemærkning" forId="note">
    <Textarea id="note" bind:value={noteText} />
  </FormField>

  <div class="flex flex-wrap gap-3 mt-6">
    <Button type="submit" disabled={saving}>{saving ? 'Gemmer…' : 'Gem'}</Button>
    <Button variant="secondary" href="/venteliste">Tilbage</Button>
  </div>
</form>