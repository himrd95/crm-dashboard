import { Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useContactContext } from '../../context/ContactContext';
import type { LayoutSection } from '../../types';

interface NotesPanelProps {
  section: LayoutSection;
}

export function NotesPanel({ section }: NotesPanelProps) {
  const { activeRecord, addNote, activeContact } = useContactContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setShowAddForm(false);
    setNewNote('');
  }, [activeContact.id]);

  useEffect(() => {
    if (showAddForm && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showAddForm]);

  const handleAdd = () => {
    if (!newNote.trim()) return;
    addNote(newNote);
    setNewNote('');
    setShowAddForm(false);
  };

  return (
    <div className="notes-panel panel panel--notes">
      <header className="panel__header panel__header--notes">
        <h2 className="panel__title">{section.title ?? 'Notes'}</h2>
        <div className="panel__header-actions">
          {section.showAddButton && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setShowAddForm((s) => !s)}
            >
              <Plus size={14} />
              Add
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            aria-label="Close add form"
            onClick={() => setShowAddForm(false)}
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {showAddForm && (
        <div className="note-add-form">
          <textarea
            ref={textareaRef}
            className="note-add-form__textarea"
            placeholder="Write a note..."
            value={newNote}
            rows={4}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd();
            }}
          />
          <div className="note-add-form__actions">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                setShowAddForm(false);
                setNewNote('');
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={handleAdd}
              disabled={!newNote.trim()}
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      <div className="notes-list">
        {activeRecord.notes.length === 0 && !showAddForm && (
          <p className="notes-empty">No notes yet. Click Add to create one.</p>
        )}
        {activeRecord.notes.map((note) => (
          <article
            key={note.id}
            className={`note-card ${note.overdue ? 'note-card--overdue' : ''}`}
          >
            <p className="note-card__content">{note.content}</p>
            <footer className="note-card__footer">
              <span>{note.author}</span>
              <span>{note.relativeTime}</span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
