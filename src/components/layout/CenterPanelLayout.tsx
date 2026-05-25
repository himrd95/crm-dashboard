import { useState } from 'react';
import type { LayoutSection } from '../../types';
import { SectionRenderer } from './SectionRenderer';
import { PanelResizeHandle } from './PanelResizeHandle';

interface CenterPanelLayoutProps {
  sections: LayoutSection[];
}

const MIN_NOTES_HEIGHT = 120;
const DEFAULT_NOTES_HEIGHT = 260;

export function CenterPanelLayout({ sections }: CenterPanelLayoutProps) {
  const [notesHeight, setNotesHeight] = useState(DEFAULT_NOTES_HEIGHT);

  const conversationsSection = sections.find((s) => s.type === 'conversations');
  const notesSection = sections.find((s) => s.type === 'notes');
  const hasSplit = conversationsSection && notesSection;

  if (!hasSplit) {
    return (
      <div className="center-panel-layout center-panel-layout--single">
        {sections.map((section, i) => (
          <SectionRenderer key={`center-${section.type}-${i}`} section={section} />
        ))}
      </div>
    );
  }

  return (
    <div className="center-panel-layout center-panel-layout--split">
      <div className="center-panel-layout__conversations">
        <SectionRenderer section={conversationsSection} />
      </div>

      <PanelResizeHandle
        axis="vertical"
        onResize={(delta) =>
          setNotesHeight((h) =>
            Math.max(
              MIN_NOTES_HEIGHT,
              Math.min(window.innerHeight * 0.55, h - delta),
            ),
          )
        }
      />

      <div
        className="center-panel-layout__notes"
        style={{ height: notesHeight, flexShrink: 0 }}
      >
        <SectionRenderer section={notesSection} />
      </div>
    </div>
  );
}
