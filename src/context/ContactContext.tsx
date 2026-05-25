import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  ContactData,
  ContactFieldsConfig,
  ContactPageData,
  ContactRecord,
  ConversationMessage,
  LayoutConfig,
  Note,
  PanelCollapseState,
  PanelSizes,
} from '../types';
import { formatRelativeTime, generateId } from '../utils/time';

const DEFAULT_PANEL_SIZES: PanelSizes = { left: 320, right: 280 };
const MIN_PANEL_WIDTH = 200;
const MAX_LEFT_WIDTH = 480;
const MAX_RIGHT_WIDTH = 420;

interface ContactContextValue {
  layout: LayoutConfig;
  contactFields: ContactFieldsConfig;
  contacts: ContactData[];
  activeContact: ContactData;
  activeIndex: number;
  activeRecord: ContactRecord;
  panelSizes: PanelSizes;
  panelCollapsed: PanelCollapseState;
  updateField: (key: string, value: string | string[]) => void;
  navigateContact: (direction: 'prev' | 'next') => void;
  addNote: (content: string) => void;
  sendMessage: (body: string, asChatBubble?: boolean) => void;
  replyToMessage: (messageId: string) => void;
  clearReplyTarget: () => void;
  replyTargetId: string | null;
  updateSubject: (subject: string) => void;
  setPanelWidth: (panel: 'left' | 'right', width: number) => void;
  togglePanelCollapse: (panel: keyof PanelCollapseState) => void;
  isTwoPanel: boolean;
}

const ContactContext = createContext<ContactContextValue | null>(null);

interface ContactProviderProps {
  data: ContactPageData;
  children: ReactNode;
}

function cloneRecords(
  records: ContactPageData['contactRecords'],
): Record<string, ContactRecord> {
  const out: Record<string, ContactRecord> = {};
  for (const [id, record] of Object.entries(records)) {
    out[id] = {
      subject: record.subject,
      messages: record.messages.map((m) => ({ ...m })),
      notes: record.notes.map((n) => ({ ...n })),
    };
  }
  return out;
}

export function ContactProvider({ data, children }: ContactProviderProps) {
  const [contacts, setContacts] = useState<ContactData[]>(() =>
    data.contacts.map((c, i) => ({
      ...c,
      recordIndex: i + 1,
      recordTotal: data.contacts.length,
    })),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [records, setRecords] = useState(() => cloneRecords(data.contactRecords));
  const [panelSizes, setPanelSizes] = useState<PanelSizes>(DEFAULT_PANEL_SIZES);
  const [panelCollapsed, setPanelCollapsed] = useState<PanelCollapseState>({
    left: false,
    center: false,
    right: false,
  });
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);

  const activeContact = contacts[activeIndex];
  const contactId = String(activeContact.id);
  const activeRecord = records[contactId] ?? {
    subject: '',
    messages: [],
    notes: [],
  };

  const isTwoPanel = data.layout.layoutType === 'two-panel';

  const updateField = useCallback((key: string, value: string | string[]) => {
    setContacts((prev) =>
      prev.map((c, i) => (i === activeIndex ? { ...c, [key]: value } : c)),
    );
  }, [activeIndex]);

  const navigateContact = useCallback(
    (direction: 'prev' | 'next') => {
      setActiveIndex((i) => {
        const next =
          direction === 'next'
            ? Math.min(i + 1, contacts.length - 1)
            : Math.max(i - 1, 0);
        return next;
      });
      setReplyTargetId(null);
    },
    [contacts.length],
  );

  const addNote = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      const note: Note = {
        id: generateId('note'),
        content: content.trim(),
        author: 'You',
        createdAt: new Date().toISOString(),
        relativeTime: 'Just now',
      };
      setRecords((prev) => ({
        ...prev,
        [contactId]: {
          ...prev[contactId],
          notes: [note, ...(prev[contactId]?.notes ?? [])],
        },
      }));
    },
    [contactId],
  );

  const sendMessage = useCallback(
    (body: string, asChatBubble = false) => {
      if (!body.trim()) return;
      const toName = `${activeContact.firstName} ${activeContact.lastName}`.trim();

      setRecords((prev) => {
        const record = prev[contactId];
        const replyMsg = replyTargetId
          ? record?.messages.find((m) => m.id === replyTargetId)
          : null;

        const message: ConversationMessage = {
          id: generateId('msg'),
          sender: 'You',
          to: toName,
          timestamp: formatRelativeTime(new Date()),
          body: replyMsg
            ? `Re: ${replyMsg.body.slice(0, 80)}${replyMsg.body.length > 80 ? '…' : ''}\n\n${body.trim()}`
            : body.trim(),
          isOutgoing: true,
          isChatBubble: asChatBubble,
        };

        return {
          ...prev,
          [contactId]: {
            ...record,
            subject: record?.subject ?? '',
            notes: record?.notes ?? [],
            messages: [...(record?.messages ?? []), message],
          },
        };
      });
      setReplyTargetId(null);
    },
    [activeContact, contactId, replyTargetId],
  );

  const replyToMessage = useCallback((messageId: string) => {
    setReplyTargetId(messageId);
  }, []);

  const clearReplyTarget = useCallback(() => setReplyTargetId(null), []);

  const updateSubject = useCallback(
    (subject: string) => {
      setRecords((prev) => ({
        ...prev,
        [contactId]: { ...prev[contactId], subject },
      }));
    },
    [contactId],
  );

  const setPanelWidth = useCallback((panel: 'left' | 'right', width: number) => {
    const clamped =
      panel === 'left'
        ? Math.min(MAX_LEFT_WIDTH, Math.max(MIN_PANEL_WIDTH, width))
        : Math.min(MAX_RIGHT_WIDTH, Math.max(MIN_PANEL_WIDTH, width));
    setPanelSizes((s) => ({ ...s, [panel]: clamped }));
  }, []);

  const togglePanelCollapse = useCallback((panel: keyof PanelCollapseState) => {
    setPanelCollapsed((s) => ({ ...s, [panel]: !s[panel] }));
  }, []);

  const value = useMemo<ContactContextValue>(
    () => ({
      layout: data.layout,
      contactFields: data.contactFields,
      contacts,
      activeContact,
      activeIndex,
      activeRecord,
      panelSizes,
      panelCollapsed,
      updateField,
      navigateContact,
      addNote,
      sendMessage,
      replyToMessage,
      clearReplyTarget,
      replyTargetId,
      updateSubject,
      setPanelWidth,
      togglePanelCollapse,
      isTwoPanel,
    }),
    [
      data.layout,
      data.contactFields,
      contacts,
      activeContact,
      activeIndex,
      activeRecord,
      panelSizes,
      panelCollapsed,
      updateField,
      navigateContact,
      addNote,
      sendMessage,
      replyToMessage,
      clearReplyTarget,
      replyTargetId,
      updateSubject,
      setPanelWidth,
      togglePanelCollapse,
      isTwoPanel,
    ],
  );

  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
}

export function useContactContext(): ContactContextValue {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error('useContactContext must be used within ContactProvider');
  return ctx;
}
