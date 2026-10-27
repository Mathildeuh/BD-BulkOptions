<div align="center">

# BD-BulkOptions

**The complete bulk server management suite for Discord.**  
*Available for both BetterDiscord and Vencord / Vesktop.*

[![GitHub license](https://img.shields.io/github/license/Mathildeuh/BD-BulkOptions?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Mathildeuh/BD-BulkOptions?style=flat-square)](https://github.com/Mathildeuh/BD-BulkOptions/stargazers)
[![BetterDiscord](https://img.shields.io/badge/BetterDiscord-Supported-7289da?style=flat-square&logo=discord&logoColor=white)](betterdiscord/)
[![Vencord](https://img.shields.io/badge/Vencord-Supported-5865F2?style=flat-square)](vencord/)
[![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20FR%20%7C%20ES%20%7C%20DE-brightgreen?style=flat-square)](#-internationalization-i18n)

[Quick Start](#-quick-start) •
[Features](#-features) •
[Installation](#-installation) •
[Usage](#-usage) •
[Architecture](#-repository-structure) •
[License](#-license)

</div>

---

## 📖 Overview

**BD-BulkOptions** solves one of Discord's most tedious problems: server overload.  
Whether you need to leave dozens of inactive servers, empty entire folders in a single click, or bulk acknowledge/mute channels, BD-BulkOptions provides a native, safe, and professional solution.

### Key Highlights

- **Anti-Rate-Limit Queue**: Sequential dispatching with configurable delays and automatic HTTP 429 (`retry_after`) handling.
- **Folder Quick-Leave**: Right-click any server folder in your sidebar to leave all contained servers at once.
- **Bulk Operations**: Multi-select servers to leave, mark as read, mute, or unmute notifications.
- **Owner Protection**: Automatically detects and protects servers you own to prevent API errors.
- **Native Discord Dark UI**: Designed strictly to match official Discord desktop aesthetics (no clutter, no unnecessary animations).
- **Customizable Shortcut**: Open the manager modal from anywhere with your custom keybind (`Ctrl + Alt + B` by default).
- **Multi-language**: Built-in support for English, French, Spanish, and German with automatic locale detection.

---

## 🗂️ Platform Editions

| Feature | [BetterDiscord Edition](betterdiscord/) | [Vencord / Vesktop Edition](vencord/) |
| :--- | :---: | :---: |
| **File Format** | Standard `.plugin.js` | TypeScript Userplugin (`index.tsx` + `style.css`) |
| **Installation** | Copy to `plugins/` folder | Copy to `userplugins/` or custom `vencordDir` |
| **Shortcut Support** | Full (Configurable in settings) | Full (Configurable in settings) |
| **Context Menus** | Folders & Guilds | Folders & Guilds |
| **Rate Limit Engine** | Multi-level backoff + REST fallback | Native async queue + backoff |
| **Languages** | EN, FR, ES, DE (Auto-detect) | EN, FR, ES, DE (Auto-detect) |

---

## 🚀 Quick Start

### 1. BetterDiscord
Download [`BD-BulkOptions.plugin.js`](https://raw.githubusercontent.com/Mathildeuh/BD-BulkOptions/main/betterdiscord/BD-BulkOptions.plugin.js) and place it into your BetterDiscord `plugins` directory:

```bash
# Windows
%APPDATA%\BetterDiscord\plugins\

# macOS
~/Library/Application Support/BetterDiscord/plugins/

# Linux
~/.config/BetterDiscord/plugins/
```

### 2. Vencord / Vesktop
Copy the [`vencord/`](vencord/) directory into your Vencord userplugins folder as `bulkOptions`:

```bash
# Vesktop (Windows)
%APPDATA%\vesktop\userplugins\bulkOptions\

# Vesktop (Linux)
~/.config/vesktop/userplugins/bulkOptions/
```
*(Or point Vesktop's `vencordDir` to your compiled Vencord build. See [Vencord Guide](vencord/README.md).)*

---

## 🎮 Usage

### 1. Opening the Server Manager
- Press **`Ctrl + Alt + B`** (configurable in settings).
- Or right-click any server in your sidebar > **Server Manager...**.
- Or right-click any folder > **Manage folder servers**.

### 2. One-Click Folder Leaving
- Right-click any server folder in your sidebar.
- Click **Leave folder (X servers)**.
- Confirm the dialog to start the safe, sequential queue.

### 3. Executing Bulk Actions
Inside the Server Manager:
1. Use the filter tabs (**All**, **Folders**, **No Folder**, **Owned**) or the search bar to find target servers.
2. Select target servers individually or use **Select All** / **Invert**.
3. Choose an action:
   - **Leave**: Safely exit all selected servers.
   - **Mark as Read**: Clear unread badges and mentions across selected servers.
   - **Mute**: Mute selected server notifications.
   - **Unmute**: Restore notification settings.
4. A real-time progress monitor will display each operation's status with an immediate abort option.

---

## 🛡️ Anti-Rate-Limit Protection

Discord's API strictly enforces rate limits on guild actions. BD-BulkOptions protects your account with:

- **Configurable Inter-Request Delays**:
  - `1.0s` — Fast (recommended for 5-10 servers)
  - `1.5s` — Balanced (default & recommended)
  - `2.0s` — Safe (recommended for large bulk batches)
  - `3.0s` — Ultra-Safe (ideal for 50+ servers)
- **Automatic 429 Recovery**: Automatically reads Discord's `retry_after` response header and pauses execution until the rate limit window resets.
- **Ownership Exclusion**: Servers where you have guild owner privileges are automatically excluded from leave queues.

---

## 🌍 Internationalization (i18n)

BD-BulkOptions automatically detects your Discord client language and adapts its interface instantly:

| Language | Code | Native Name | Status |
| :--- | :---: | :--- | :---: |
| **English** | `en` | English | Supported |
| **French** | `fr` | Français | Supported |
| **Spanish** | `es` | Español | Supported |
| **German** | `de` | Deutsch | Supported |

*(You can also force a specific language at any time in the plugin settings).*

---

## 📁 Repository Structure

```text
BD-BulkOptions/
├── .github/                      # GitHub configuration & issue templates
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── betterdiscord/                # BetterDiscord edition
│   ├── BD-BulkOptions.plugin.js  # Production BetterDiscord plugin
│   └── README.md                 # BetterDiscord-specific documentation
├── vencord/                      # Vencord edition
│   ├── index.tsx                 # Vencord TypeScript userplugin
│   ├── style.css                 # Native Discord dark mode styles
│   └── README.md                 # Vencord & Vesktop setup guide
├── .editorconfig                 # Code formatting standard
├── .gitignore                    # Git ignore definitions
├── LICENSE                       # MIT License
└── README.md                     # Main documentation (this file)
```

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome!
1. Fork the project.
2. Create your feature branch (`git checkout -b feat/my-new-feature`).
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m "feat: add support for channel category bulk mute"`).
4. Push to the branch (`git push origin feat/my-new-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE) © 2026 Mathilde.
