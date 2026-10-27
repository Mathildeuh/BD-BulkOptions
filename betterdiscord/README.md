# BD-BulkOptions — BetterDiscord Edition

> **Bulk server management plugin for BetterDiscord.**  
> Leave multiple servers simultaneously, empty folders in one click, mark servers as read, and mute/unmute notifications with anti-rate-limit protection.

---

## Direct Download

- **Download Plugin**: [`BD-BulkOptions.plugin.js`](https://raw.githubusercontent.com/Mathildeuh/BD-BulkOptions/main/betterdiscord/BD-BulkOptions.plugin.js)

---

## Installation

1. Download [`BD-BulkOptions.plugin.js`](https://raw.githubusercontent.com/Mathildeuh/BD-BulkOptions/main/betterdiscord/BD-BulkOptions.plugin.js).
2. Move the file into your BetterDiscord `plugins` folder:
   - **Windows**: `%APPDATA%\BetterDiscord\plugins\`
   - **macOS**: `~/Library/Application Support/BetterDiscord/plugins/`
   - **Linux**: `~/.config/BetterDiscord/plugins/`
3. Restart or reload Discord (`Ctrl + R`).
4. Go to **Discord Settings > Plugins** and toggle **BD-BulkOptions** on.

---

## Usage

### 1. Opening the Manager
- **Shortcut**: Press `Ctrl + Alt + B` (default, customizable in plugin settings).
- **Context Menu**: Right-click any server in your sidebar > **Server Manager...**.
- **Settings**: Open **Discord Settings > Plugins > BD-BulkOptions > Open Server Manager**.

### 2. One-Click Folder Leave
- Right-click any folder in your server sidebar.
- Click **Leave folder (X servers)**.
- Confirm the prompt to begin the safe, sequential leave queue.

### 3. Bulk Operations
Inside the manager modal:
- **Filters**: Quickly filter by *All*, *Folders*, *No Folder*, or *Owned*.
- **Search**: Search servers by name with real-time filtering.
- **Select All / Invert**: Quickly select or invert selections.
- **Actions**:
  - **Leave**: Safely exit all selected guilds.
  - **Mark as Read**: Acknowledge unread messages and notifications.
  - **Mute**: Mute selected server notifications.
  - **Unmute**: Restore notification settings.

---

## Configuration

In **Discord Settings > Plugins > BD-BulkOptions**:
- **Anti-Rate-Limit Delay**: Choose between `1.0s` (fast), `1.5s` (recommended), `2.0s` (safe), or `3.0s` (extra safe).
- **Keyboard Shortcut**: Click **Change Shortcut** and type your desired combination.
- **Language**: Choose between *Automatic (Discord)*, *English*, *Français*, *Español*, or *Deutsch*.

---

## License

MIT © Mathilde
