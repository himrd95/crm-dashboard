import { Mail, Phone } from 'lucide-react';
import { useContactContext } from '../../context/ContactContext';
import type { ContactField } from '../../types';
import { getFieldValue } from '../../utils/fieldValue';
import { Avatar } from '../common/Avatar';

interface FieldRendererProps {
  field: ContactField;
}

export function FieldRenderer({ field }: FieldRendererProps) {
  const { activeContact, updateField } = useContactContext();
  const raw = getFieldValue(activeContact, field.key);
  const stringValue = Array.isArray(raw) ? raw.join(', ') : String(raw ?? '');

  const handleChange = (value: string) => {
    if (field.type === 'multi-select') {
      updateField(
        field.key,
        value.split(',').map((s) => s.trim()).filter(Boolean),
      );
    } else {
      updateField(field.key, value);
    }
  };

  switch (field.type) {
    case 'phone':
      return (
        <div className="field-row">
          <label className="field-row__label" htmlFor={`field-${field.key}`}>
            {field.label}
          </label>
          <div className="field-row__value field-row__value--phone">
            <span className="flag-icon" title="US">🇺🇸</span>
            <input
              id={`field-${field.key}`}
              className="field-input"
              type="tel"
              value={stringValue}
              onChange={(e) => handleChange(e.target.value)}
            />
            <button type="button" className="icon-btn icon-btn--primary" aria-label="Call">
              <Phone size={14} />
            </button>
          </div>
        </div>
      );

    case 'email':
      return (
        <div className="field-row">
          <label className="field-row__label" htmlFor={`field-${field.key}`}>
            {field.label}
          </label>
          <div className="field-row__value field-row__value--email">
            <Mail size={14} className="field-icon" />
            <input
              id={`field-${field.key}`}
              className="field-input"
              type="email"
              value={stringValue}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        </div>
      );

    case 'user':
      return (
        <div className="field-row">
          <label className="field-row__label" htmlFor={`field-${field.key}`}>
            {field.label}
          </label>
          <div className="field-row__value field-row__value--user">
            <Avatar name={stringValue || '?'} size="sm" />
            <input
              id={`field-${field.key}`}
              className="field-input"
              type="text"
              value={stringValue}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        </div>
      );

    case 'multi-select':
      return (
        <div className="field-row">
          <label className="field-row__label" htmlFor={`field-${field.key}`}>
            {field.label}
          </label>
          <div className="field-row__value field-row__value--followers">
            {Array.isArray(raw) &&
              raw.map((name) => (
                <Avatar key={String(name)} name={String(name)} size="sm" />
              ))}
            <input
              id={`field-${field.key}`}
              className="field-input field-input--wide"
              type="text"
              placeholder="Comma-separated names"
              value={stringValue}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        </div>
      );

    case 'radio':
    case 'string':
    default:
      return (
        <div className="field-row">
          <label className="field-row__label" htmlFor={`field-${field.key}`}>
            {field.label}
          </label>
          <input
            id={`field-${field.key}`}
            className="field-input"
            type="text"
            value={stringValue}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      );
  }
}
