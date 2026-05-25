import { FileText, History, Settings, Users } from 'lucide-react';
import type { LayoutConfig } from '../../types';

const ICON_MAP = {
  history: History,
  users: Users,
  file: FileText,
  settings: Settings,
} as const;

interface UtilitySidebarProps {
  config: LayoutConfig['utilitySidebar'];
}

export function UtilitySidebar({ config }: UtilitySidebarProps) {
  if (!config.enabled) return null;

  return (
    <aside className="utility-sidebar" aria-label="Quick tools">
      {config.items.map((item) => {
        const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP] ?? Settings;
        return (
          <button
            key={item.id}
            type="button"
            className="utility-sidebar__btn"
            title={item.label}
            aria-label={item.label}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </aside>
  );
}
