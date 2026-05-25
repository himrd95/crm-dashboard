import { GripHorizontal, GripVertical } from 'lucide-react';
import { usePanelResize } from '../../hooks/usePanelResize';

interface PanelResizeHandleProps {
  onResize: (delta: number) => void;
  axis?: 'horizontal' | 'vertical';
}

export function PanelResizeHandle({ onResize, axis = 'horizontal' }: PanelResizeHandleProps) {
  const { onMouseDown } = usePanelResize({ onResize, axis });

  return (
    <div
      className={`panel-resize-handle panel-resize-handle--${axis}`}
      onMouseDown={onMouseDown}
      role="separator"
      aria-orientation={axis === 'vertical' ? 'horizontal' : 'vertical'}
      aria-label="Resize panel"
    >
      {axis === 'vertical' ? <GripHorizontal size={14} /> : <GripVertical size={14} />}
    </div>
  );
}
