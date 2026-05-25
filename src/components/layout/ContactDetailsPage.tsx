import { LayoutGrid } from 'lucide-react';
import { useContactContext } from '../../context/ContactContext';
import { LeftPanel } from '../contact/LeftPanel';
import { SectionRenderer } from './SectionRenderer';
import { UtilitySidebar } from './UtilitySidebar';
import { ResizablePanel } from './ResizablePanel';
import { PanelResizeHandle } from './PanelResizeHandle';
import { CenterPanelLayout } from './CenterPanelLayout';

interface ContactDetailsPageProps {
  layoutVariant: 'default' | 'alt';
  onSwitchLayout: () => void;
}

export function ContactDetailsPage({
  layoutVariant,
  onSwitchLayout,
}: ContactDetailsPageProps) {
  const {
    layout,
    isTwoPanel,
    panelSizes,
    panelCollapsed,
    setPanelWidth,
    togglePanelCollapse,
  } = useContactContext();

  const centerSections = layout.centerPanel.sections;
  const rightSections = layout.rightPanel.sections;
  const showRightPanel = !isTwoPanel && rightSections.length > 0;

  return (
    <div className={`app-shell ${isTwoPanel ? 'app-shell--two-panel' : ''}`}>
      <header className="app-toolbar">
        <span className="app-toolbar__brand">HighLevel CRM</span>
        <button
          type="button"
          className="btn btn--outline btn--sm layout-toggle"
          onClick={onSwitchLayout}
          title="Toggle between 3-panel and 2-panel layouts"
        >
          <LayoutGrid size={14} />
          {layoutVariant === 'default' ? 'Switch to 2-panel' : 'Switch to 3-panel'}
        </button>
      </header>

      <div className="app-main">
        <ResizablePanel
          panelId="left"
          width={panelSizes.left}
          collapsed={panelCollapsed.left}
          onToggleCollapse={() => togglePanelCollapse('left')}
          className="panel panel--left"
          collapsedLabel="Contact"
        >
          <LeftPanel />
        </ResizablePanel>

        {!panelCollapsed.left && (
          <PanelResizeHandle
            onResize={(delta) => setPanelWidth('left', panelSizes.left + delta)}
          />
        )}

        <ResizablePanel
          panelId="center"
          collapsed={panelCollapsed.center}
          onToggleCollapse={() => togglePanelCollapse('center')}
          className="app-center"
          collapsedLabel="Chat"
        >
          <CenterPanelLayout sections={centerSections} />
        </ResizablePanel>

        {showRightPanel && (
          <>
            {!panelCollapsed.center && !panelCollapsed.right && (
              <PanelResizeHandle
                onResize={(delta) => setPanelWidth('right', panelSizes.right + delta)}
              />
            )}
            <ResizablePanel
              panelId="right"
              width={panelSizes.right}
              collapsed={panelCollapsed.right}
              onToggleCollapse={() => togglePanelCollapse('right')}
              className="panel panel--right app-right"
              collapsedLabel="Notes"
            >
              {rightSections.map((section, i) => (
                <SectionRenderer key={`right-${section.type}-${i}`} section={section} />
              ))}
            </ResizablePanel>
          </>
        )}

        <UtilitySidebar config={layout.utilitySidebar} />
      </div>
    </div>
  );
}
