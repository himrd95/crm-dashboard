export type FieldType =
  | 'string'
  | 'phone'
  | 'email'
  | 'radio'
  | 'user'
  | 'multi-select';

export interface ContactField {
  key: string;
  label: string;
  type: FieldType;
}

export interface ContactFolder {
  id: string;
  name: string;
  defaultExpanded?: boolean;
  fields: ContactField[];
}

export interface ContactFieldsConfig {
  folders: ContactFolder[];
}

export type ContactData = Record<string, string | string[] | number> & {
  id?: string;
  recordIndex?: number;
  recordTotal?: number;
};

export interface LayoutTab {
  id: string;
  label: string;
}

export interface LayoutSection {
  type: string;
  title?: string;
  collapsible?: boolean;
  showAddButton?: boolean;
}

export interface LayoutConfig {
  layoutType: 'three-panel' | 'two-panel';
  contactCard: {
    showAvatar: boolean;
    showTags: boolean;
    showOwner: boolean;
    showFollowers: boolean;
    showPhoneAction: boolean;
  };
  leftPanel: {
    title: string;
    tabs: LayoutTab[];
    defaultTab: string;
    showSearch: boolean;
    sections: LayoutSection[];
  };
  centerPanel: {
    sections: LayoutSection[];
  };
  rightPanel: {
    sections: LayoutSection[];
  };
  utilitySidebar: {
    enabled: boolean;
    items: { id: string; label: string; icon: string }[];
  };
}

export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  relativeTime: string;
  overdue?: boolean;
}

export interface NotesConfig {
  notes: Note[];
}

export interface ConversationMessage {
  id: string;
  sender: string;
  to: string;
  timestamp: string;
  body: string;
  hasAction?: boolean;
  actionLabel?: string;
  starred?: boolean;
  isOutgoing?: boolean;
  isChatBubble?: boolean;
}

export interface ConversationsConfig {
  subject: string;
  messages: ConversationMessage[];
  typingIndicator?: {
    user: string;
    active: boolean;
  };
}

export interface ContactsListConfig {
  contacts: ContactData[];
}

export interface ContactRecord {
  subject: string;
  messages: ConversationMessage[];
  notes: Note[];
}

export interface ContactRecordsConfig {
  [contactId: string]: ContactRecord;
}

export interface PanelSizes {
  left: number;
  right: number;
}

export interface PanelCollapseState {
  left: boolean;
  center: boolean;
  right: boolean;
}

export interface ContactPageData {
  layout: LayoutConfig;
  contactFields: ContactFieldsConfig;
  contacts: ContactData[];
  contactRecords: ContactRecordsConfig;
}
