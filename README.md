# HighLevel CRM — Dynamic Contact Details Page

A config-driven CRM contact details UI built for the **SDE 3 - CRM - Contacts** take-home assignment. The page layout, field folders, and data are all rendered dynamically from JSON configuration files.

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

## Deploy to Netlify

This project includes a [`netlify.toml`](netlify.toml) so Netlify picks up the correct build settings automatically.

### Option A — Deploy from GitHub (recommended)

1. Push the repo to GitHub (if you have not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HighLevel CRM contact details"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/highlevel-crm-dashboard.git
   git push -u origin main
   ```
2. Log in to [Netlify](https://app.netlify.com/) → **Add new site** → **Import an existing project**.
3. Connect GitHub and select this repository.
4. Netlify should detect:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**. No environment variables are required.

After deploy, your site will be live at a URL like `https://random-name.netlify.app`. JSON configs load from `/data/*` (copied from `public/data/` during build).

### Option A — Netlify CLI

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

Follow the prompts to link or create a site.

### Local check before deploy

```bash
npm run build
npm run preview
```

Open the preview URL and confirm contacts, conversations, and notes load correctly.

## Folder Structure

```
highlevel-crm-dashboard/
├── public/data/           # JSON configs (served as static assets)
│   ├── layout.json        # Page layout & panel order
│   ├── layout-alt.json    # Alternate 2-panel layout (bonus toggle)
│   ├── contactFields.json   # Field folders & types
│   ├── contacts.json        # Contact profiles (4 contacts)
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

## Assignment Alignment

Built to match the HighLevel CRM contact details screenshot:

- Left: Contact card, tabs, searchable collapsible field folders
- Center: Conversations with message cards and compose area
- Right: Yellow sticky notes
- Far right: Utility icon sidebar
