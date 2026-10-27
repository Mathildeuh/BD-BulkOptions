# BD-BulkOptions

> **Bulk server manager for Discord — available for both BetterDiscord & Vencord.**  
> Leave multiple servers at once, empty/leave entire folders in one click, mark as read, and mute/unmute notifications with built-in rate-limit protection.

---

## Editions

| Edition | Location | Type |
| :--- | :--- | :--- |
| **BetterDiscord** | [`BD-BulkOptions.plugin.js`](BD-BulkOptions.plugin.js) | Standard `.plugin.js` |
| **Vencord** | [`vencord/`](vencord/) | Userplugin (`index.tsx` + `style.css`) |

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
- **Clean Discord-Native Dark UI**: Designed strictly to blend seamlessly into Discord's native dark interface.

---

## Installation

### 1. BetterDiscord
1. Download [`BD-BulkOptions.plugin.js`](https://raw.githubusercontent.com/Mathildeuh/BD-BulkOptions/main/BD-BulkOptions.plugin.js).
2. Place the file into your BetterDiscord plugins folder:
   - **Windows**: `%APPDATA%\BetterDiscord\plugins\`
   - **macOS**: `~/Library/Application Support/BetterDiscord/plugins/`
   - **Linux**: `~/.config/BetterDiscord/plugins/`
3. Enable **BD-BulkOptions** in **Discord Settings > Plugins**.

### 2. Vencord / Vesktop
1. Copy the [`vencord/`](vencord/) folder into your Vencord userplugins folder:
   - Target folder: `userplugins/bulkOptions/`
   - **Windows (Vesktop)**: `%APPDATA%\vesktop\userplugins\bulkOptions\`
   - **Linux**: `~/.config/vesktop/userplugins/bulkOptions/`
2. Or place it in `src/userplugins/bulkOptions` when building Vencord from source.
3. Enable **BulkOptions** in **Discord Settings > Vencord > Plugins**.
4. See [`vencord/README.md`](vencord/README.md) for full instructions.

---

## Usage

### 1. Opening the Manager
- Press your configured shortcut (default: **`Ctrl + Alt + B`**).
- Or right-click any server in your server list and choose **Server Manager...**.
- Or right-click any folder and select **Manage folder servers**.
- Or open via the plugin settings.

### 2. Leaving an Entire Folder
- Right-click any folder in your Discord server list.
- Click **Leave folder (X servers)**.
- Confirm the dialog to start the safe leave queue.

### 3. Customizing the Keyboard Shortcut
- Go to Discord Settings > Plugins (or Vencord Plugins).
- Open settings for **BD-BulkOptions** / **BulkOptions**.
- Set your preferred combination.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
