import { ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

interface ResizablePanelProps {
  panelId: 'left' | 'center' | 'right';
  width?: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  children: ReactNode;
  className?: string;
  collapsedLabel?: string;
}

export function ResizablePanel({
  panelId,
  width,
  collapsed,
  onToggleCollapse,
  children,
  className = '',
  collapsedLabel,
}: ResizablePanelProps) {
  const style: CSSProperties | undefined =
    collapsed
      ? undefined
      : panelId === 'center'
        ? { flex: 1, minWidth: 0 }
        : width
          ? { width: `${width}px`, flexShrink: 0, minWidth: 0 }
          : undefined;

  if (collapsed) {
    return (
      <div className={`resizable-panel resizable-panel--collapsed ${className}`}>
        <button
          type="button"
          className="resizable-panel__expand-btn"
          onClick={onToggleCollapse}
          title={`Expand ${collapsedLabel ?? panelId} panel`}
          aria-label={`Expand ${collapsedLabel ?? panelId} panel`}
        >
          {panelId === 'left' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          <span className="resizable-panel__collapsed-label">
            {collapsedLabel ?? panelId}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`resizable-panel ${className}`}
      style={style}
      data-panel={panelId}
    >
      <div className="resizable-panel__toolbar">
        <button
          type="button"
          className="resizable-panel__collapse-btn"
          onClick={onToggleCollapse}
          title={`Collapse ${collapsedLabel ?? panelId} panel`}
          aria-label={`Collapse ${collapsedLabel ?? panelId} panel`}
        >
          {panelId === 'left' ? (
            <PanelLeftClose size={16} />
          ) : panelId === 'right' ? (
            <PanelRightClose size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </button>
      </div>
      <div className="resizable-panel__content">{children}</div>
    </div>
  );
}
