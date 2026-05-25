import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ContactFolder } from '../../types';
import { FieldRenderer } from './FieldRenderer';
import { useContactContext } from '../../context/ContactContext';
import { getFieldValue } from '../../utils/fieldValue';

interface FolderSectionProps {
  folder: ContactFolder;
  searchQuery: string;
}

export function FolderSection({ folder, searchQuery }: FolderSectionProps) {
  const { activeContact } = useContactContext();
  const [expanded, setExpanded] = useState(folder.defaultExpanded ?? true);

  const visibleFields = folder.fields.filter((field) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const val = String(getFieldValue(activeContact, field.key) ?? '').toLowerCase();
    return (
      field.label.toLowerCase().includes(q) ||
      field.key.toLowerCase().includes(q) ||
      val.includes(q)
    );
  });

  if (visibleFields.length === 0) return null;

  return (
    <section className="folder">
      <button
        type="button"
        className="folder__header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <span className="folder__title">{folder.name}</span>
        <ChevronDown
          size={16}
          className={`folder__chevron ${expanded ? 'folder__chevron--open' : ''}`}
        />
      </button>
      {expanded && (
        <div className="folder__body">
          {visibleFields.map((field) => (
            <FieldRenderer key={field.key} field={field} />
          ))}
        </div>
      )}
    </section>
  );
}
