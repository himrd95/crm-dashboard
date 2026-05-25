import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { useContactContext } from '../../context/ContactContext';
import { ContactCard } from './ContactCard';
import { FolderSection } from '../fields/FolderSection';

export function LeftPanel() {
  const { layout, contactFields } = useContactContext();
  const { leftPanel } = layout;
  const [activeTab, setActiveTab] = useState(leftPanel.defaultTab);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <header className="panel__header">
        <h1 className="panel__title">{leftPanel.title}</h1>
      </header>

      <ContactCard />

      <nav className="tabs" role="tablist">
        {leftPanel.tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tabs__item ${activeTab === tab.id ? 'tabs__item--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'allFields' && (
        <>
          {leftPanel.showSearch && (
            <div className="search-bar">
              <Search size={16} className="search-bar__icon" />
              <input
                type="search"
                className="search-bar__input"
                placeholder="Search fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="icon-btn" aria-label="Filter fields">
                <Filter size={16} />
              </button>
            </div>
          )}

          <div className="folders">
            {contactFields.folders.map((folder) => (
              <FolderSection key={folder.id} folder={folder} searchQuery={searchQuery} />
            ))}
          </div>
        </>
      )}

      {activeTab === 'dnd' && (
        <div className="panel-placeholder">
          <p>Do Not Disturb settings for this contact.</p>
          <label className="dnd-toggle">
            <input type="checkbox" /> Block all communications
          </label>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="panel-placeholder panel-placeholder--actions">
          <button type="button" className="btn btn--outline btn--sm">Send Email</button>
          <button type="button" className="btn btn--outline btn--sm">Schedule Call</button>
          <button type="button" className="btn btn--outline btn--sm">Create Task</button>
        </div>
      )}
    </>
  );
}
