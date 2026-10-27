# BulkOptions for Vencord

> **Vencord userplugin for bulk server management.**  
> Leave multiple servers at once, leave entire server folders in one click, mark servers as read, and mute/unmute notifications with built-in anti-rate-limit protection.

---

## Features

- **Bulk Server Leave**: Select multiple servers via checkboxes, quick filter tabs, or search, and safely leave them sequentially.
- **One-Click Folder Leave**: Right-click any Discord folder to leave all its servers simultaneously.
- **Bulk Actions**:
  - Leave selected servers
  - Mark selected servers as read
  - Mute notifications
  - Unmute notifications
- **Anti-Rate-Limit Protection**: Controlled sequential requests with configurable delay (1.0s, 1.5s, 2.0s, 3.0s) and automatic handling of Discord HTTP 429 (`retry_after`).
- **Owner Protection**: Automatically detects servers you own (`Owner`) and safely skips them from leave queues to prevent API failures.
- **Customizable Keyboard Shortcut**: Open the server manager anytime (default: `Ctrl + Alt + B`), customizable directly in Vencord Plugin Settings.
- **Full Multilingual Support (i18n)**: English, French, Spanish, German with Discord language auto-detection or manual selection.
- **Clean Discord-Native Dark UI**: Designed strictly to match Discord's native dark surfaces, typography, and controls.

---

## Installation

### Option A: Vesktop / Vencord Userplugins Directory
If you use Vesktop or Vencord with external userplugin loading enabled:

1. Locate your Vencord userplugins directory:
   - **Windows**: `%APPDATA%\Vencord\src\userplugins\` or `%APPDATA%\vesktop\userplugins\`
   - **Linux**: `~/.config/Vencord/src/userplugins/` or `~/.config/vesktop/userplugins/`
   - **macOS**: `~/Library/Application Support/Vencord/src/userplugins/` or `~/Library/Application Support/vesktop/userplugins/`
2. Copy the `vencord` folder into your userplugins folder and rename it to `bulkOptions`:
   ```bash
   # Destination structure:
   userplugins/
     └── bulkOptions/
           ├── index.tsx
           ├── style.css
           └── README.md
   ```
3. Restart Discord / Vesktop.
4. Enable **BulkOptions** in **Discord Settings > Vencord > Plugins**.

### Option B: Building Vencord from Source
1. Clone or copy the `vencord` folder into `src/userplugins/bulkOptions` in your Vencord repository:
   ```bash
   git clone https://github.com/Vendicated/Vencord.git
   cd Vencord
   mkdir -p src/userplugins/bulkOptions
   cp -r /path/to/BD-BulkOptions/vencord/* src/userplugins/bulkOptions/
   ```
2. Build or run Vencord:
   ```bash
   pnpm install
   pnpm build
   ```
3. Inject Vencord into Discord and enable **BulkOptions** in Settings.

---

## Usage

- **Shortcut**: Press `Ctrl + Alt + B` (or your configured shortcut in plugin settings).
- **Folder Context Menu**: Right-click any folder > **Leave folder (X servers)** or **Manage folder servers**.
- **Server Context Menu**: Right-click any server > **Server Manager...**.
- **Vencord Settings**: Adjust delay, shortcut, and language anytime in **Discord Settings > Vencord > Plugins > BulkOptions**.

---

## License

MIT © Mathilde
