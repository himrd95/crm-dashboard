import type { LayoutSection } from '../../types';
import { ConversationsPanel } from '../conversations/ConversationsPanel';
import { NotesPanel } from '../notes/NotesPanel';

interface SectionRendererProps {
  section: LayoutSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case 'conversations':
      return <ConversationsPanel section={section} />;
    case 'notes':
      return <NotesPanel section={section} />;
    default:
      return null;
  }
}
