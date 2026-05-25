import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { useContactContext } from '../../context/ContactContext';
import { Avatar } from '../common/Avatar';
import { Tag } from '../common/Tag';

const VISIBLE_TAG_COUNT = 2;

export function ContactCard() {
  const { activeContact, layout, navigateContact, contacts, activeIndex } =
    useContactContext();
  const config = layout.contactCard;

  const fullName = `${activeContact.firstName ?? ''} ${activeContact.lastName ?? ''}`.trim();
  const tags = Array.isArray(activeContact.tags) ? activeContact.tags : [];
  const visibleTags = tags.slice(0, VISIBLE_TAG_COUNT);
  const hiddenCount = tags.length - VISIBLE_TAG_COUNT;

  return (
    <div className="contact-card">
      <div className="contact-card__nav">
        <span className="contact-card__count">
          {activeIndex + 1} of {contacts.length}
        </span>
        <div className="contact-card__nav-btns">
          <button
            type="button"
            className="icon-btn"
            aria-label="Previous contact"
            disabled={activeIndex === 0}
            onClick={() => navigateContact('prev')}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Next contact"
            disabled={activeIndex === contacts.length - 1}
            onClick={() => navigateContact('next')}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="contact-card__profile">
        {config.showAvatar && <Avatar name={fullName} size="lg" />}
        <div className="contact-card__info">
          <h2 className="contact-card__name">{fullName}</h2>
          {config.showPhoneAction && activeContact.phone && (
            <a
              href={`tel:${String(activeContact.phone).replace(/\D/g, '')}`}
              className="contact-card__phone-btn"
              aria-label="Call"
            >
              <Phone size={16} />
            </a>
          )}
        </div>
      </div>

      {config.showOwner && activeContact.owner && (
        <div className="contact-card__meta">
          <span className="contact-card__meta-label">Owner</span>
          <div className="contact-card__meta-value">
            <Avatar name={String(activeContact.owner)} size="sm" />
            <span>{String(activeContact.owner)}</span>
          </div>
        </div>
      )}

      {config.showFollowers &&
        Array.isArray(activeContact.followers) &&
        activeContact.followers.length > 0 && (
          <div className="contact-card__meta">
            <span className="contact-card__meta-label">Followers</span>
            <div className="contact-card__meta-value contact-card__followers">
              {activeContact.followers.map((f) => (
                <Avatar key={String(f)} name={String(f)} size="sm" />
              ))}
            </div>
          </div>
        )}

      {config.showTags && tags.length > 0 && (
        <div className="contact-card__tags">
          {visibleTags.map((tag) => (
            <Tag
              key={String(tag)}
              label={String(tag)}
              variant={
                String(tag).toLowerCase().includes('vip')
                  ? 'vip'
                  : String(tag).toLowerCase().includes('shared')
                    ? 'shared'
                    : 'default'
              }
            />
          ))}
          {hiddenCount > 0 && <span className="tag tag--more">+{hiddenCount}</span>}
        </div>
      )}
    </div>
  );
}
