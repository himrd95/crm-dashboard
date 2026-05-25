import { useCallback, useEffect, useRef } from 'react';

interface UsePanelResizeOptions {
  onResize: (delta: number) => void;
  axis?: 'horizontal' | 'vertical';
}

export function usePanelResize({ onResize, axis = 'horizontal' }: UsePanelResizeOptions) {
  const dragging = useRef(false);
  const lastPos = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    lastPos.current = axis === 'vertical' ? e.clientY : e.clientX;
    document.body.style.cursor = axis === 'vertical' ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  }, [axis]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const pos = axis === 'vertical' ? e.clientY : e.clientX;
      const delta = pos - lastPos.current;
      lastPos.current = pos;
      onResize(delta);
    };

    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onResize, axis]);

  return { onMouseDown };
}
