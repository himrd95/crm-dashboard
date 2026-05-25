# HighLevel CRM — Dynamic Contact Details Page

A config-driven CRM contact details UI built assignment. The page layout, field folders, and data are all rendered dynamically from JSON configuration files.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for dev server and build
- **Lucide React** for icons
- Plain CSS (no UI framework) for layout fidelity

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
npm run build    # production build
npm run preview  # preview production build
```

## Folder Structure

```
highlevel-crm-dashboard/
├── public/data/           # JSON configs (served as static assets)
│   ├── layout.json        # Page layout & panel order
│   ├── layout-alt.json    # Alternate 2-panel layout
│   ├── contactFields.json   # Field folders & types
│   ├── contacts.json        # Contact profiles 
│   └── contactRecords.json  # Per-contact notes & conversations
├── src/
│   ├── api/               # Mock API with in-memory cache
│   ├── components/
│   │   ├── common/        # Avatar, Tag
│   │   ├── contact/       # ContactCard, LeftPanel
│   │   ├── conversations/ # ConversationsPanel
│   │   ├── fields/        # FieldRenderer, FolderSection
│   │   ├── layout/        # Page shell, section renderer
│   │   └── notes/         # NotesPanel
│   ├── hooks/             # useContactPage
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Field value helpers
└── README.md
```

## How Each JSON Config Is Used

| File | Purpose |
|------|---------|
| `layout.json` | Controls 3-panel vs 2-panel layout, which sections appear (left/center/right), contact card options, tabs, utility sidebar, and section order. |
| `contactFields.json` | Defines folders (Contact, Additional Info, etc.) and each field's `key`, `label`, and `type`. Drives dynamic form rendering like a Google Form builder. |
| `contacts.json` | List of contact profiles and field values. |
| `contactRecords.json` | Notes and conversation threads keyed by contact id. |

### Field Types Supported

| Type | Renderer behavior |
|------|-------------------|
| `string` | Plain text display |
| `phone` | Phone with flag, edit & call icons |
| `email` | Mail icon + mailto link |
| `radio` | Selected option text |
| `user` | Avatar + name |
| `multi-select` | Row of follower avatars |

## API Mocking & Caching

`src/api/client.ts` implements a simple `fetch`-based client with an in-memory cache. All configs are loaded via `fetch('/data/...')` to simulate API calls. `resetContactCache()` clears cache when switching layouts.

## Interactive Features

- **Editable fields** — all contact fields are live inputs; changes persist while browsing
- **4 contact profiles** — use prev/next arrows on the contact card (Olivia, Marcus, Elena, James)
- **Send messages** — type in the fixed bottom textarea; Enter to send, Shift+Enter for newline
- **Reply** — click Reply on any message; banner shows who you're replying to
- **Live typing indicator** — "You are typing..." appears while the compose textarea has text
- **Add notes** — click Add in Notes panel, write content, Save Note (Cmd/Ctrl+Enter)
- **Resizable panels** — drag the grip handles between columns to resize
- **Collapsible panels** — use the collapse icon (top-right of each panel) to minimize/expand

## Bonus Features

- **Responsive layout** — stacks panels on tablet/mobile
- **Visual states** — VIP/shared tag styles, avatar initials, overdue note highlight
- **Layout toggle** — toolbar button switches between `layout.json` (3-panel) and `layout-alt.json` (2-panel)

## Known Issues

- DND and Actions tabs have basic placeholder UI only
- Panel resize is disabled on mobile (stacked layout)
- Edits are in-memory only (reset on page refresh)

