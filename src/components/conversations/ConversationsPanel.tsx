import {
  ChevronDown,
  Paperclip,
  Pencil,
  Reply,
  Send,
  Smile,
  Star,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useContactContext } from '../../context/ContactContext';
import type { LayoutSection } from '../../types';

interface ConversationsPanelProps {
  section: LayoutSection;
}

export function ConversationsPanel({ section }: ConversationsPanelProps) {
  const {
    activeContact,
    activeRecord,
    sendMessage,
    replyToMessage,
    replyTargetId,
    clearReplyTarget,
    updateSubject,
  } = useContactContext();

  const [sectionCollapsed, setSectionCollapsed] = useState(false);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [editingSubject, setEditingSubject] = useState(false);
  const [subjectDraft, setSubjectDraft] = useState(activeRecord.subject);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const contactName = `${activeContact.firstName} ${activeContact.lastName}`.trim();
  const replyTarget = activeRecord.messages.find((m) => m.id === replyTargetId);

  useEffect(() => {
    setSubjectDraft(activeRecord.subject);
    setDraft('');
    setIsTyping(false);
    clearReplyTarget();
  }, [activeContact.id, activeRecord.subject, clearReplyTarget]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [activeRecord.messages.length]);

  useEffect(() => {
    if (replyTargetId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyTargetId]);

  const handleDraftChange = (value: string) => {
    setDraft(value);
    setIsTyping(value.trim().length > 0);
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    const asBubble = draft.trim().length < 40 && !draft.includes('\n');
    sendMessage(draft, asBubble);
    setDraft('');
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const saveSubject = () => {
    updateSubject(subjectDraft);
    setEditingSubject(false);
  };

  return (
    <section className="conversations-panel">
      <header className="panel__header panel__header--collapsible conversations-panel__header">
        {section.collapsible ? (
          <button
            type="button"
            className="panel__title-btn"
            onClick={() => setSectionCollapsed((c) => !c)}
          >
            <h2 className="panel__title">{section.title ?? 'Conversations'}</h2>
            <ChevronDown
              size={18}
              className={`folder__chevron ${sectionCollapsed ? '' : 'folder__chevron--open'}`}
            />
          </button>
        ) : (
          <h2 className="panel__title">{section.title ?? 'Conversations'}</h2>
        )}
      </header>

      {!sectionCollapsed && (
        <div className="conversations-panel__body">
          <div className="conversations__subject">
            {editingSubject ? (
              <input
                className="field-input conversations__subject-input"
                value={subjectDraft}
                onChange={(e) => setSubjectDraft(e.target.value)}
                onBlur={saveSubject}
                onKeyDown={(e) => e.key === 'Enter' && saveSubject()}
                autoFocus
              />
            ) : (
              <p>{activeRecord.subject}</p>
            )}
            <button
              type="button"
              className="icon-btn"
              aria-label="Edit subject"
              onClick={() => setEditingSubject(true)}
            >
              <Pencil size={14} />
            </button>
          </div>

          <div className="conversations__thread" ref={threadRef}>
            {activeRecord.messages.map((msg) =>
              msg.isChatBubble ? (
                <div
                  key={msg.id}
                  className={`chat-bubble ${msg.isOutgoing ? 'chat-bubble--outgoing' : ''}`}
                >
                  {msg.body}
                </div>
              ) : (
                <article
                  key={msg.id}
                  className={`message-card ${msg.isOutgoing ? 'message-card--outgoing' : ''}`}
                >
                  <header className="message-card__header">
                    <div>
                      <strong>{msg.sender}</strong>
                      <span className="message-card__to">To: {msg.to}</span>
                    </div>
                    <div className="message-card__actions">
                      <span className="message-card__time">{msg.timestamp}</span>
                      {!msg.isOutgoing && (
                        <button type="button" className="icon-btn" aria-label="Star">
                          <Star size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Reply"
                        onClick={() => replyToMessage(msg.id)}
                      >
                        <Reply size={14} />
                      </button>
                    </div>
                  </header>
                  <p className="message-card__body">{msg.body}</p>
                  {msg.hasAction && msg.actionLabel && (
                    <button type="button" className="btn btn--primary btn--sm">
                      {msg.actionLabel}
                    </button>
                  )}
                  {!msg.isOutgoing && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm message-card__reply"
                      onClick={() => replyToMessage(msg.id)}
                    >
                      Reply
                    </button>
                  )}
                </article>
              ),
            )}
          </div>

          {isTyping && (
            <p className="typing-indicator typing-indicator--live">
              <span className="typing-dots" />
              You are typing...
            </p>
          )}

          <div className="message-compose">
            {replyTarget && (
              <div className="message-compose__reply-banner">
                <span>
                  Replying to <strong>{replyTarget.sender}</strong>
                </span>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Cancel reply"
                  onClick={clearReplyTarget}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="message-compose__inner">
              <textarea
                ref={textareaRef}
                className="message-compose__textarea"
                placeholder={`Message ${contactName}...`}
                value={draft}
                rows={3}
                onChange={(e) => handleDraftChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (!draft.trim()) setIsTyping(false);
                }}
              />
              <div className="message-compose__actions">
                <button type="button" className="icon-btn" aria-label="Attach file">
                  <Paperclip size={18} />
                </button>
                <button type="button" className="icon-btn" aria-label="Add emoji">
                  <Smile size={18} />
                </button>
                <button
                  type="button"
                  className="btn btn--primary btn--send"
                  onClick={handleSend}
                  disabled={!draft.trim()}
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
