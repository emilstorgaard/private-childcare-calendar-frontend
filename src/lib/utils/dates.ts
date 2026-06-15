export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('da-DK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('da-DK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function toInputDate(iso: string): string {
  return iso.split('T')[0];
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}