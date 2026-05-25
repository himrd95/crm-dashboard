import type { ContactData } from '../types';

export function getFieldValue(
  data: ContactData,
  key: string,
): string | string[] | number | undefined {
  return data[key];
}

export function formatDisplayValue(
  value: string | string[] | number | undefined,
): string {
  if (value === undefined || value === null) return '—';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
