<script lang="ts">
  import { goto } from '$app/navigation';
  import { notesApi } from '$lib/api/notes';
  import { ApiError } from '$lib/api/client';
  import { toInputDate, today } from '$lib/utils/dates';
  import {
    FormField,
    Input,
    Textarea,
    Button,
    Alert
  } from '$lib/components/ui';
  import type { CalendarNote, CalendarNoteRequest } from '$lib/types';

  interface Props {
    note?: CalendarNote;
    defaultDate?: string;
  }

  let { note, defaultDate }: Props = $props();

  let title = $state(note?.title ?? '');
  let date = $state(note ? toInputDate(note.date) : (defaultDate ?? today()));
  let noteText = $state(note?.note ?? '');

  let error = $state('');
  let saving = $state(false);

  const isEdit = !!note;

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    saving = true;

    const payload: CalendarNoteRequest = { title, date, note: noteText || null };

    try {
      if (isEdit && note) {
        await notesApi.update(note.id, payload);
      } else {
        await notesApi.create(payload);
      }
      await goto('/kalenderinfo');
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Der opstod en uventet fejl.';
      saving = false;
    }
  }
</script>

<form onsubmit={handleSubmit}>
  {#if error}
    <Alert type="error" message={error} />
  {/if}

  <FormField label="Overskrift" forId="title">
    <Input id="title" bind:value={title} required />
  </FormField>

  <FormField label="Dato" forId="date">
    <Input id="date" type="date" bind:value={date} required />
  </FormField>

  <FormField label="Bemærkning" forId="note">
    <Textarea id="note" bind:value={noteText} />
  </FormField>

  <div class="flex flex-wrap gap-3 mt-6">
    <Button type="submit" disabled={saving}>
      {saving ? 'Gemmer…' : 'Gem'}
    </Button>
    <Button variant="secondary" href="/kalenderinfo">Tilbage</Button>
  </div>
</form>