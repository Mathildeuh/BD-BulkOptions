# BD-BulkOptions

> **BetterDiscord plugin for bulk server management.**  
> Leave multiple servers at once, empty/leave entire folders in one click, mark as read, and mute/unmute notifications with built-in rate-limit protection.

---

## Features

- **Bulk Server Leave**: Select multiple servers using checkboxes, quick filter tabs, or search, and leave them all in a controlled, safe sequence.
- **One-Click Folder Leave**: Right-click any Discord folder to leave all its servers simultaneously.
- **Bulk Actions**:
  - Leave selected servers
  - Mark selected servers as read
  - Mute server notifications
  - Unmute server notifications
- **Anti-Rate-Limit Protection**: Sequentially paces requests with a configurable delay (1.0s, 1.5s, 2.0s, 3.0s) and handles Discord HTTP 429 (`retry_after`) automatically.
- **Ownership Protection**: Servers you own (`Owner`) are automatically detected and excluded from leave actions to prevent API errors.
- **Customizable Keyboard Shortcut**: Open the manager at any time using your preferred shortcut (default: `Ctrl + Alt + B`), customizable directly from the plugin settings.
- **Multilingual (i18n)**: Supports English, French, Spanish, and German with automatic Discord language detection and on-the-fly language switching.

---

## Installation

1. Download [`BD-BulkOptions.plugin.js`](https://raw.githubusercontent.com/Mathildeuh/BD-BulkOptions/main/BD-BulkOptions.plugin.js).
2. Place the file into your BetterDiscord plugins folder:
   - **Windows**: `%APPDATA%\BetterDiscord\plugins\`
   - **macOS**: `~/Library/Application Support/BetterDiscord/plugins/`
   - **Linux**: `~/.config/BetterDiscord/plugins/`
3. Enable **BD-BulkOptions** in **Discord Settings > Plugins**.

---

## Usage

### 1. Opening the Manager
- Press your configured shortcut (default: **`Ctrl + Alt + B`**).
- Or right-click any server in your server list and choose **Server Manager...**.
- Or open **Discord Settings > Plugins > BD-BulkOptions > Open Server Manager**.

### 2. Leaving an Entire Folder
- Right-click any folder in your Discord server list.
- Click **Leave folder (X servers)**.
- Confirm the dialog to start the safe leave queue.

### 3. Customizing the Keyboard Shortcut
- Go to **Discord Settings > Plugins**.
- Click the gear icon on **BD-BulkOptions**.
- Click **Change Shortcut** and press your desired key combination.

---

## Screenshots & Interface

- **Native Discord Dark UI**: Follows official Discord design patterns and typography.
- **Live Progress Monitor**: Displays current progress, success/failure metrics, and a real-time event log with an emergency abort button.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
