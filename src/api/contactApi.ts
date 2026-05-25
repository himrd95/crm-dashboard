import { fetchJson, clearApiCache } from './client';
import type {
  ContactFieldsConfig,
  ContactRecordsConfig,
  ContactsListConfig,
  LayoutConfig,
  ContactPageData,
} from '../types';

const DATA_BASE = '/data';

export async function fetchLayout(layoutFile = 'layout.json'): Promise<LayoutConfig> {
  return fetchJson<LayoutConfig>(`${DATA_BASE}/${layoutFile}`);
}

export async function fetchContactFields(): Promise<ContactFieldsConfig> {
  return fetchJson<ContactFieldsConfig>(`${DATA_BASE}/contactFields.json`);
}

export async function fetchContacts(): Promise<ContactsListConfig> {
  return fetchJson<ContactsListConfig>(`${DATA_BASE}/contacts.json`);
}

export async function fetchContactRecords(): Promise<ContactRecordsConfig> {
  return fetchJson<ContactRecordsConfig>(`${DATA_BASE}/contactRecords.json`);
}

export async function fetchContactPage(
  layoutFile = 'layout.json',
): Promise<ContactPageData> {
  const [layout, contactFields, contactsList, contactRecords] = await Promise.all([
    fetchLayout(layoutFile),
    fetchContactFields(),
    fetchContacts(),
    fetchContactRecords(),
  ]);

  return {
    layout,
    contactFields,
    contacts: contactsList.contacts,
    contactRecords,
  };
}

export function resetContactCache(): void {
  clearApiCache();
}
