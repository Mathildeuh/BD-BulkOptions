/**
 * @name BD-BulkOptions
 * @author Mathilde
 * @version 1.3.0
 * @description Bulk server management for BetterDiscord. Leave multiple servers, leave entire folders in one click, mark as read, or mute with rate-limit protection and customizable shortcut.
 * @source https://github.com/Mathildeuh/BD-BulkOptions
 * @updateUrl https://raw.githubusercontent.com/Mathildeuh/BD-BulkOptions/main/betterdiscord/BD-BulkOptions.plugin.js
 */

module.exports = (() => {
    "use strict";

    const CSS_ID = "guild-bulk-manager-styles";
    const CONTAINER_ID = "guild-bulk-manager-container";
    const STORAGE_KEY_LOCALE = "BD-BulkOptions-Locale";
    const STORAGE_KEY_SHORTCUT = "BD-BulkOptions-Shortcut";

    const DEFAULT_SHORTCUT = { ctrl: true, alt: true, shift: false, key: "b" };

    function loadShortcut() {
        try {
            const raw = (typeof BdApi?.Data?.load === "function" && BdApi.Data.load("BD-BulkOptions", "shortcut")) ||
                        (window.localStorage && JSON.parse(window.localStorage.getItem(STORAGE_KEY_SHORTCUT) || "null"));
            if (raw && raw.key) return raw;
        } catch (e) {}
        return { ...DEFAULT_SHORTCUT };
    }

    function saveShortcut(shortcut) {
        try {
            if (typeof BdApi?.Data?.save === "function") {
                BdApi.Data.save("BD-BulkOptions", "shortcut", shortcut);
            }
        } catch (e) {}
        try {
            if (window.localStorage) {
                window.localStorage.setItem(STORAGE_KEY_SHORTCUT, JSON.stringify(shortcut));
            }
        } catch (e) {}
    }

    function formatShortcut(s) {
        if (!s || !s.key) return "Ctrl + Alt + B";
        const parts = [];
        if (s.ctrl) parts.push("Ctrl");
        if (s.alt) parts.push("Alt");
        if (s.shift) parts.push("Shift");
        parts.push(s.key.length === 1 ? s.key.toUpperCase() : s.key);
        return parts.join(" + ");
    }

    // Traductions multilingues (FR, EN, ES, DE)
    const TRANSLATIONS = {
        fr: {
            title: "Gestionnaire de serveurs",
            searchPlaceholder: "Rechercher par nom...",
            allFolders: "Tous les dossiers",
            noFolder: "Sans dossier",
            delay: "Délai",
            tabAll: "Tous",
            tabFolders: "Dossiers",
            tabNoFolder: "Sans dossier",
            tabOwned: "Propriétaire",
            selectAll: "Tout sélectionner",
            deselectAll: "Désélectionner",
            invertSelection: "Inverser",
            selectedCount: (n) => `${n} sélectionné(s)`,
            actionLeave: "Quitter",
            actionAck: "Marquer comme lu",
            actionMute: "Muter",
            actionUnmute: "Démuter",
            ownerBadge: "Propriétaire",
            emptySearch: "Aucun serveur ne correspond aux critères de recherche.",
            execRunning: "Exécution en cours...",
            execDone: "Opération terminée",
            current: "En cours",
            statusSuccess: (n) => `${n} réussi(s)`,
            statusError: (n) => `${n} échec(s)`,
            statusSkipped: "Ignoré (propriétaire)",
            statusQuit: "Quitté",
            statusAcked: "Marqué comme lu",
            statusMuted: "Sourdine activée",
            statusUnmuted: "Sourdine désactivée",
            btnStop: "Interrompre",
            btnClose: "Fermer",
            btnCancel: "Annuler",
            btnConfirm: "Confirmer",
            confirmLeaveTitle: (n) => `Quitter ${n} serveur(s)`,
            confirmLeaveDesc: "Voulez-vous vraiment quitter ces serveurs ? Cette action est irréversible.",
            confirmLeaveFolderTitle: (name) => `Quitter le dossier "${name}"`,
            confirmLeaveFolderDesc: (n) => `Vous allez quitter ${n} serveur(s) de ce dossier.`,
            ownedWarning: (n) => `${n} serveur(s) dont vous êtes le propriétaire seront automatiquement ignorés.`,
            shortcutHint: "Raccourci :",
            contextMenuLeaveFolder: (n) => `Quitter le dossier (${n} serveurs)`,
            contextMenuManageFolder: "Gérer ce dossier...",
            contextMenuManageServer: "Gestionnaire de serveurs...",
            folderEmptyToast: "Dossier vide.",
            activeRateLimit: "Temporisation active entre chaque serveur",
            settingsShortcutTitle: "Raccourci clavier",
            settingsShortcutDesc: "Combinaison de touches pour ouvrir rapidement le gestionnaire de serveurs.",
            settingsShortcutRecord: "Modifier le raccourci",
            settingsShortcutRecording: "Appuyez sur la combinaison...",
            settingsShortcutReset: "Réinitialiser",
            settingsOpenBtn: "Ouvrir le gestionnaire"
        },
        en: {
            title: "Server Manager",
            searchPlaceholder: "Search by name...",
            allFolders: "All folders",
            noFolder: "No folder",
            delay: "Delay",
            tabAll: "All",
            tabFolders: "Folders",
            tabNoFolder: "No folder",
            tabOwned: "Owner",
            selectAll: "Select all",
            deselectAll: "Deselect",
            invertSelection: "Invert",
            selectedCount: (n) => `${n} selected`,
            actionLeave: "Leave",
            actionAck: "Mark as read",
            actionMute: "Mute",
            actionUnmute: "Unmute",
            ownerBadge: "Owner",
            emptySearch: "No servers match the search criteria.",
            execRunning: "Execution in progress...",
            execDone: "Operation completed",
            current: "Current",
            statusSuccess: (n) => `${n} succeeded`,
            statusError: (n) => `${n} failed`,
            statusSkipped: "Skipped (owner)",
            statusQuit: "Left",
            statusAcked: "Marked as read",
            statusMuted: "Muted",
            statusUnmuted: "Unmuted",
            btnStop: "Stop",
            btnClose: "Close",
            btnCancel: "Cancel",
            btnConfirm: "Confirm",
            confirmLeaveTitle: (n) => `Leave ${n} server(s)`,
            confirmLeaveDesc: "Are you sure you want to leave these servers? This action cannot be undone.",
            confirmLeaveFolderTitle: (name) => `Leave folder "${name}"`,
            confirmLeaveFolderDesc: (n) => `You are about to leave ${n} server(s) in this folder.`,
            ownedWarning: (n) => `${n} server(s) where you are the owner will be skipped.`,
            shortcutHint: "Shortcut:",
            contextMenuLeaveFolder: (n) => `Leave folder (${n} servers)`,
            contextMenuManageFolder: "Manage this folder...",
            contextMenuManageServer: "Server Manager...",
            folderEmptyToast: "Folder is empty.",
            activeRateLimit: "Rate-limit safety delay active between each server",
            settingsShortcutTitle: "Keyboard Shortcut",
            settingsShortcutDesc: "Key combination to open the bulk server manager.",
            settingsShortcutRecord: "Change Shortcut",
            settingsShortcutRecording: "Press shortcut keys...",
            settingsShortcutReset: "Reset",
            settingsOpenBtn: "Open Server Manager"
        },
        es: {
            title: "Gestor de servidores",
            searchPlaceholder: "Buscar por nombre...",
            allFolders: "Todas las carpetas",
            noFolder: "Sin carpeta",
            delay: "Pausa",
            tabAll: "Todos",
            tabFolders: "Carpetas",
            tabNoFolder: "Sin carpeta",
            tabOwned: "Propietario",
            selectAll: "Seleccionar todo",
            deselectAll: "Deseleccionar",
            invertSelection: "Invertir",
            selectedCount: (n) => `${n} seleccionado(s)`,
            actionLeave: "Salir",
            actionAck: "Marcar leído",
            actionMute: "Silenciar",
            actionUnmute: "Reactivar",
            ownerBadge: "Propietario",
            emptySearch: "Ningún servidor coincide con los filtros.",
            execRunning: "Ejecución en curso...",
            execDone: "Operación completada",
            current: "En curso",
            statusSuccess: (n) => `${n} éxito(s)`,
            statusError: (n) => `${n} error(es)`,
            statusSkipped: "Ignorado (propietario)",
            statusQuit: "Salido",
            statusAcked: "Marcado leído",
            statusMuted: "Silenciado",
            statusUnmuted: "Reactivado",
            btnStop: "Detener",
            btnClose: "Cerrar",
            btnCancel: "Cancelar",
            btnConfirm: "Confirmar",
            confirmLeaveTitle: (n) => `Salir de ${n} servidor(es)`,
            confirmLeaveDesc: "¿Seguro que quieres salir de estos servidores? Esta acción es irreversible.",
            confirmLeaveFolderTitle: (name) => `Salir de la carpeta "${name}"`,
            confirmLeaveFolderDesc: (n) => `Vas a salir de ${n} servidor(es) de esta carpeta.`,
            ownedWarning: (n) => `${n} servidor(es) donde eres propietario serán ignorados.`,
            shortcutHint: "Atajo:",
            contextMenuLeaveFolder: (n) => `Salir de la carpeta (${n} servidores)`,
            contextMenuManageFolder: "Gestionar esta carpeta...",
            contextMenuManageServer: "Gestor de servidores...",
            folderEmptyToast: "Carpeta vacía.",
            activeRateLimit: "Pausa de seguridad activa entre cada servidor",
            settingsShortcutTitle: "Atajo de teclado",
            settingsShortcutDesc: "Combinación de teclas para abrir el gestor de servidores.",
            settingsShortcutRecord: "Cambiar atajo",
            settingsShortcutRecording: "Presiona la combinación...",
            settingsShortcutReset: "Restablecer",
            settingsOpenBtn: "Abrir el gestor"
        },
        de: {
            title: "Server-Manager",
            searchPlaceholder: "Nach Name suchen...",
            allFolders: "Alle Ordner",
            noFolder: "Ohne Ordner",
            delay: "Verzögerung",
            tabAll: "Alle",
            tabFolders: "Ordner",
            tabNoFolder: "Ohne Ordner",
            tabOwned: "Besitzer",
            selectAll: "Alle auswählen",
            deselectAll: "Auswahl aufheben",
            invertSelection: "Umkehren",
            selectedCount: (n) => `${n} ausgewählt`,
            actionLeave: "Verlassen",
            actionAck: "Als gelesen markieren",
            actionMute: "Stummschalten",
            actionUnmute: "Entstummen",
            ownerBadge: "Besitzer",
            emptySearch: "Keine Server entsprechen den Suchkriterien.",
            execRunning: "Ausführung läuft...",
            execDone: "Vorgang abgeschlossen",
            current: "Aktuell",
            statusSuccess: (n) => `${n} erfolgreich`,
            statusError: (n) => `${n} fehlgeschlagen`,
            statusSkipped: "Übersprungen (Besitzer)",
            statusQuit: "Verlassen",
            statusAcked: "Gelesen",
            statusMuted: "Stummgeschaltet",
            statusUnmuted: "Entstummt",
            btnStop: "Abbrechen",
            btnClose: "Schließen",
            btnCancel: "Abbrechen",
            btnConfirm: "Bestätigen",
            confirmLeaveTitle: (n) => `${n} Server verlassen`,
            confirmLeaveDesc: "Möchtest du diese Server wirklich verlassen? Dies kann nicht rückgängig gemacht werden.",
            confirmLeaveFolderTitle: (name) => `Ordner "${name}" verlassen`,
            confirmLeaveFolderDesc: (n) => `Du bist dabei, ${n} Server in diesem Ordner zu verlassen.`,
            ownedWarning: (n) => `${n} Server, deren Besitzer du bist, werden übersprungen.`,
            shortcutHint: "Kürzel:",
            contextMenuLeaveFolder: (n) => `Ordner verlassen (${n} Server)`,
            contextMenuManageFolder: "Diesen Ordner verwalten...",
            contextMenuManageServer: "Server-Manager...",
            folderEmptyToast: "Ordner ist leer.",
            activeRateLimit: "Sicherheitsverzögerung zwischen Servern aktiv",
            settingsShortcutTitle: "Tastenkombination",
            settingsShortcutDesc: "Tastenkürzel zum schnellen Öffnen des Server-Managers.",
            settingsShortcutRecord: "Kürzel ändern",
            settingsShortcutRecording: "Tasten drücken...",
            settingsShortcutReset: "Zurücksetzen",
            settingsOpenBtn: "Server-Manager öffnen"
        }
    };

    function detectLocale() {
        try {
            const saved = window.localStorage?.getItem(STORAGE_KEY_LOCALE);
            if (saved && TRANSLATIONS[saved]) return saved;
        } catch (e) {}

        const raw = (document.documentElement.lang || navigator.language || "en").toLowerCase();
        if (raw.startsWith("fr")) return "fr";
        if (raw.startsWith("es")) return "es";
        if (raw.startsWith("de")) return "de";
        return "en";
    }

    function getStrings(lang) {
        return TRANSLATIONS[lang] || TRANSLATIONS.en;
    }

    // Styles Discord Natifs
    const STYLES = `
        .gbm-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: gbm-fade 0.12s ease;
            user-select: none;
        }

        @keyframes gbm-fade {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .gbm-modal {
            background: var(--background-primary, #313338);
            color: var(--text-normal, #dbdee1);
            width: 800px;
            max-width: 95vw;
            height: 700px;
            max-height: 90vh;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: var(--font-primary, "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif);
            border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
            position: relative;
        }

        .gbm-header {
            padding: 16px 20px;
            background: var(--background-secondary, #2b2d31);
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.08));
        }

        .gbm-header-title {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: -0.1px;
            color: var(--header-primary, #f2f3f5);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .gbm-header-count {
            font-size: 12px;
            font-weight: 500;
            color: var(--text-muted, #949ba4);
        }

        .gbm-header-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .gbm-lang-select {
            background: var(--background-tertiary, #1e1f22);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: var(--text-normal, #dbdee1);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11.5px;
            font-weight: 600;
            outline: none;
            cursor: pointer;
        }

        .gbm-close-btn {
            background: transparent;
            border: none;
            color: var(--interactive-normal, #b5bac1);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.1s, background 0.1s;
        }

        .gbm-close-btn:hover {
            color: var(--interactive-hover, #ffffff);
            background: rgba(255, 255, 255, 0.06);
        }

        .gbm-filter-bar {
            padding: 12px 20px;
            background: var(--background-secondary, #2b2d31);
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-bottom: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.08));
        }

        .gbm-filter-row {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .gbm-search-box {
            position: relative;
            flex: 1;
        }

        .gbm-search-input {
            width: 100%;
            box-sizing: border-box;
            background: var(--background-tertiary, #1e1f22);
            border: 1px solid transparent;
            color: var(--text-normal, #dbdee1);
            padding: 8px 32px 8px 34px;
            border-radius: 4px;
            font-size: 13.5px;
            outline: none;
            transition: border-color 0.15s, background-color 0.15s;
        }

        .gbm-search-input:focus {
            border-color: var(--brand-experiment, #5865f2);
            background: var(--background-tertiary, #111214);
        }

        .gbm-search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted, #949ba4);
            pointer-events: none;
        }

        .gbm-search-clear {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: var(--text-muted, #949ba4);
            cursor: pointer;
            padding: 2px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .gbm-search-clear:hover {
            color: var(--interactive-hover, #ffffff);
        }

        .gbm-select {
            background: var(--background-tertiary, #1e1f22);
            border: 1px solid transparent;
            color: var(--text-normal, #dbdee1);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 13px;
            outline: none;
            cursor: pointer;
            transition: border-color 0.15s;
        }

        .gbm-select:focus {
            border-color: var(--brand-experiment, #5865f2);
        }

        .gbm-tabs-row {
            display: flex;
            gap: 6px;
            align-items: center;
        }

        .gbm-tab-btn {
            background: transparent;
            border: none;
            color: var(--text-muted, #949ba4);
            font-size: 12.5px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.1s;
        }

        .gbm-tab-btn:hover {
            color: var(--text-normal, #dbdee1);
            background: rgba(255, 255, 255, 0.05);
        }

        .gbm-tab-btn.active {
            color: var(--header-primary, #ffffff);
            background: rgba(255, 255, 255, 0.1);
        }

        .gbm-actions-bar {
            padding: 10px 20px;
            background: var(--background-primary, #313338);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            border-bottom: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.06));
        }

        .gbm-selection-summary {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: var(--text-muted, #949ba4);
        }

        .gbm-selection-count {
            color: var(--header-primary, #f2f3f5);
            font-weight: 600;
        }

        .gbm-btn-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .gbm-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: background 0.12s, opacity 0.12s;
            user-select: none;
            height: 32px;
            box-sizing: border-box;
        }

        .gbm-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .gbm-btn-danger {
            background: var(--button-danger-background, #da373c);
            color: #ffffff;
        }

        .gbm-btn-danger:hover:not(:disabled) {
            background: var(--button-danger-background-hover, #a1282c);
        }

        .gbm-btn-primary {
            background: var(--brand-experiment, #5865f2);
            color: #ffffff;
        }

        .gbm-btn-primary:hover:not(:disabled) {
            background: #4752c4;
        }

        .gbm-btn-secondary {
            background: var(--background-tertiary, #1e1f22);
            color: var(--header-primary, #f2f3f5);
            border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
        }

        .gbm-btn-secondary:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.06);
        }

        .gbm-btn-link {
            background: transparent;
            color: var(--text-muted, #949ba4);
            font-size: 12.5px;
            padding: 4px 6px;
            height: auto;
        }

        .gbm-btn-link:hover:not(:disabled) {
            color: var(--interactive-hover, #ffffff);
            text-decoration: underline;
        }

        .gbm-checkbox {
            width: 18px;
            height: 18px;
            border-radius: 4px;
            border: 1px solid var(--text-muted, #80848e);
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: border-color 0.1s, background-color 0.1s;
            flex-shrink: 0;
            cursor: pointer;
        }

        .gbm-checkbox:hover {
            border-color: var(--interactive-hover, #ffffff);
        }

        .gbm-checkbox.checked {
            background: var(--brand-experiment, #5865f2);
            border-color: var(--brand-experiment, #5865f2);
            color: #ffffff;
        }

        .gbm-list-container {
            flex: 1;
            overflow-y: auto;
            padding: 8px 12px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .gbm-list-container::-webkit-scrollbar {
            width: 8px;
        }

        .gbm-list-container::-webkit-scrollbar-thumb {
            background: var(--background-tertiary, #1e1f22);
            border-radius: 4px;
        }

        .gbm-guild-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 10px;
            border-radius: 4px;
            background: transparent;
            transition: background 0.08s;
            cursor: pointer;
            border: 1px solid transparent;
        }

        .gbm-guild-row:hover {
            background: var(--background-modifier-hover, rgba(255, 255, 255, 0.04));
        }

        .gbm-guild-row.selected {
            background: rgba(88, 101, 242, 0.08);
            border-color: rgba(88, 101, 242, 0.25);
        }

        .gbm-guild-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: var(--background-tertiary, #1e1f22);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #ffffff;
            font-size: 12px;
            flex-shrink: 0;
            object-fit: cover;
        }

        .gbm-guild-info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .gbm-guild-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--header-primary, #f2f3f5);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .gbm-guild-meta {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11.5px;
            color: var(--text-muted, #949ba4);
        }

        .gbm-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 1px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
            background: var(--background-tertiary, #1e1f22);
            color: var(--text-normal, #dbdee1);
        }

        .gbm-badge-folder {
            border-left: 2px solid #5865f2;
        }

        .gbm-badge-owner {
            background: rgba(240, 178, 50, 0.12);
            color: #f0b232;
        }

        .gbm-footer {
            padding: 12px 20px;
            background: var(--background-secondary, #2b2d31);
            border-top: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.08));
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12.5px;
            color: var(--text-muted, #949ba4);
        }

        .gbm-shortcut-hint {
            font-size: 12px;
            color: var(--text-muted, #80848e);
        }

        .gbm-shortcut-hint kbd {
            background: var(--background-tertiary, #1e1f22);
            padding: 2px 5px;
            border-radius: 3px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: var(--text-normal, #dbdee1);
        }

        /* Vue d'Exécution */
        .gbm-exec-overlay {
            position: absolute;
            inset: 0;
            background: var(--background-primary, #313338);
            display: flex;
            flex-direction: column;
            z-index: 20;
            animation: gbm-fade 0.1s ease;
        }

        .gbm-exec-header {
            padding: 16px 20px;
            background: var(--background-secondary, #2b2d31);
            border-bottom: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.08));
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .gbm-exec-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--header-primary, #f2f3f5);
        }

        .gbm-exec-status {
            font-size: 13px;
            color: var(--text-muted, #949ba4);
        }

        .gbm-exec-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 18px 20px;
            gap: 14px;
            overflow: hidden;
        }

        .gbm-progress-track {
            width: 100%;
            height: 8px;
            background: var(--background-tertiary, #1e1f22);
            border-radius: 4px;
            overflow: hidden;
        }

        .gbm-progress-fill {
            height: 100%;
            background: var(--brand-experiment, #5865f2);
            border-radius: 4px;
            transition: width 0.25s ease-out;
        }

        .gbm-progress-fill.danger {
            background: var(--status-danger, #da373c);
        }

        .gbm-exec-metrics {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
            color: var(--text-muted, #949ba4);
        }

        .gbm-exec-metrics-strong {
            color: var(--header-primary, #f2f3f5);
            font-weight: 600;
        }

        .gbm-log-list {
            flex: 1;
            background: var(--background-secondary, #2b2d31);
            border-radius: 6px;
            border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
            overflow-y: auto;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 2px;
            font-size: 12.5px;
        }

        .gbm-log-list::-webkit-scrollbar {
            width: 6px;
        }

        .gbm-log-list::-webkit-scrollbar-thumb {
            background: var(--background-tertiary, #1e1f22);
            border-radius: 3px;
        }

        .gbm-log-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 5px 8px;
            border-radius: 4px;
            line-height: 1.4;
        }

        .gbm-log-row:hover {
            background: rgba(255, 255, 255, 0.03);
        }

        .gbm-log-status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            flex-shrink: 0;
            background: var(--text-muted, #80848e);
        }

        .gbm-log-row.success .gbm-log-status-dot { background: var(--status-positive, #23a55a); }
        .gbm-log-row.error .gbm-log-status-dot { background: var(--status-danger, #da373c); }
        .gbm-log-row.warn .gbm-log-status-dot { background: var(--status-warning, #f0b232); }

        .gbm-log-target {
            color: var(--header-primary, #f2f3f5);
            font-weight: 500;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .gbm-log-message {
            color: var(--text-muted, #949ba4);
        }

        .gbm-log-row.error .gbm-log-message {
            color: var(--status-danger, #da373c);
        }

        .gbm-log-time {
            font-size: 11px;
            color: var(--text-muted, #80848e);
            font-family: monospace;
            flex-shrink: 0;
        }

        .gbm-exec-footer {
            padding: 14px 20px;
            background: var(--background-secondary, #2b2d31);
            border-top: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.08));
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .gbm-confirm-dialog {
            background: var(--background-primary, #313338);
            width: 480px;
            max-width: 90vw;
            border-radius: 6px;
            padding: 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            gap: 14px;
            border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
        }

        .gbm-confirm-title {
            font-size: 17px;
            font-weight: 700;
            color: var(--header-primary, #f2f3f5);
        }

        .gbm-confirm-desc {
            font-size: 13.5px;
            line-height: 1.5;
            color: var(--text-normal, #dbdee1);
        }

        .gbm-confirm-list {
            max-height: 160px;
            overflow-y: auto;
            background: var(--background-secondary, #2b2d31);
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 12.5px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .gbm-confirm-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 4px;
        }
    `;

    // Helpers Webpack
    function findByKeys(...keys) {
        let options = {};
        if (keys.length > 1 && typeof keys[keys.length - 1] === "object" && !Array.isArray(keys[keys.length - 1])) {
            options = keys.pop();
        }

        try {
            if (typeof BdApi?.Webpack?.getByKeys === "function") {
                const mod = Object.keys(options).length > 0 ?
                    BdApi.Webpack.getByKeys(...keys, options) :
                    BdApi.Webpack.getByKeys(...keys);
                if (mod) return mod;
            }
        } catch (e) {}

        try {
            if (typeof BdApi?.Webpack?.getByProps === "function") {
                const mod = BdApi.Webpack.getByProps(...keys);
                if (mod) return mod;
            }
        } catch (e) {}

        try {
            if (typeof BdApi?.findModuleByProps === "function") {
                const mod = BdApi.findModuleByProps(...keys);
                if (mod) return mod;
            }
        } catch (e) {}

        try {
            if (typeof BdApi?.Webpack?.getModule === "function") {
                if (BdApi.Webpack.Filters?.byKeys) {
                    const mod = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys(...keys), options);
                    if (mod) return mod;
                }
                if (BdApi.Webpack.Filters?.byProps) {
                    const mod = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps(...keys));
                    if (mod) return mod;
                }
                const mod = BdApi.Webpack.getModule(m => m && typeof m === "object" && keys.every(k => k in m), options);
                if (mod) return mod;
            }
        } catch (e) {}

        return null;
    }

    function findByStrings(...strings) {
        let options = {};
        if (strings.length > 1 && typeof strings[strings.length - 1] === "object" && !Array.isArray(strings[strings.length - 1])) {
            options = strings.pop();
        }

        try {
            if (typeof BdApi?.Webpack?.getByStrings === "function") {
                const mod = Object.keys(options).length > 0 ?
                    BdApi.Webpack.getByStrings(...strings, options) :
                    BdApi.Webpack.getByStrings(...strings);
                if (mod) return mod;
            }
        } catch (e) {}

        try {
            if (typeof BdApi?.Webpack?.getModule === "function" && BdApi.Webpack.Filters?.byStrings) {
                const mod = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byStrings(...strings), options);
                if (mod) return mod;
            }
        } catch (e) {}

        return null;
    }

    function getStore(name) {
        try {
            if (typeof BdApi?.Webpack?.getStore === "function") {
                const s = BdApi.Webpack.getStore(name);
                if (s) return s;
            }
        } catch (e) {}

        try {
            if (BdApi?.Webpack?.Stores && BdApi.Webpack.Stores[name]) {
                return BdApi.Webpack.Stores[name];
            }
        } catch (e) {}

        try {
            if (typeof BdApi?.Webpack?.getModule === "function" && BdApi.Webpack.Filters?.byStoreName) {
                const s = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byStoreName(name));
                if (s) return s;
            }
        } catch (e) {}

        return findByKeys("get" + name.replace("Store", "")) || null;
    }

    function getGuildStore() {
        return getStore("GuildStore") || findByKeys("getGuild", "getGuilds");
    }

    function getSortedGuildStore() {
        return getStore("SortedGuildStore") || findByKeys("getCompatibleGuildFolders") || findByKeys("getGuildFolders");
    }

    function getUserStore() {
        return getStore("UserStore") || findByKeys("getCurrentUser");
    }

    function getGuildActions() {
        return findByKeys("leaveGuild") ||
               findByKeys("leaveGuild", { searchExports: true }) ||
               findByStrings("leaveGuild") ||
               findByStrings(".leaveGuild(", { searchExports: true });
    }

    function getAckActions() {
        return findByKeys("ackGuild") ||
               findByKeys("bulkAck", "ack") ||
               findByKeys("ackGuild", { searchExports: true });
    }

    function getSettingsActions() {
        return findByKeys("updateGuildNotificationSettings") ||
               findByKeys("updateGuildNotificationSettings", { searchExports: true });
    }

    function getHttpModule() {
        return findByKeys("del", "post", "get") ||
               findByKeys("del", "post") ||
               findByKeys("del", { searchExports: true }) ||
               findByKeys("HTTP")?.HTTP;
    }

    function getDiscordToken() {
        try {
            const tokenMod = findByKeys("getToken") || findByKeys("getId", "getToken");
            if (tokenMod && typeof tokenMod.getToken === "function") {
                const t = tokenMod.getToken();
                if (t) return t;
            }
        } catch (e) {}

        try {
            if (window.__token) return window.__token;
            if (window.localStorage) {
                const raw = window.localStorage.getItem("token");
                if (raw) return JSON.parse(raw);
            }
        } catch (e) {}

        return null;
    }

    function getAcronym(name) {
        if (!name) return "?";
        return name
            .replace(/'s /g, " ")
            .replace(/\w+/g, e => e[0])
            .replace(/\s/g, "")
            .slice(0, 3)
            .toUpperCase();
    }

    function colorToHex(colorInt) {
        if (!colorInt) return "#5865f2";
        return "#" + Number(colorInt).toString(16).padStart(6, "0");
    }

    // Actions API Discord
    async function apiLeaveGuild(guildId) {
        const actions = getGuildActions();
        let leaveFn = null;
        if (typeof actions === "function") {
            leaveFn = actions;
        } else if (typeof actions?.leaveGuild === "function") {
            leaveFn = actions.leaveGuild.bind(actions);
        } else if (typeof actions?.default?.leaveGuild === "function") {
            leaveFn = actions.default.leaveGuild.bind(actions.default);
        }

        if (leaveFn) {
            try {
                return await leaveFn(guildId, false);
            } catch (err) {
                if (err?.status === 429 || (err?.message && err.message.includes("429"))) {
                    const retry = (err?.body?.retry_after || 5) * 1000;
                    await new Promise(r => setTimeout(r, retry));
                    return await leaveFn(guildId, false);
                }
                throw err;
            }
        }

        const http = getHttpModule();
        if (http && typeof http.del === "function") {
            try {
                return await http.del({ url: `/users/@me/guilds/${guildId}` });
            } catch (err) {
                if (err?.status === 429 || err?.body?.retry_after) {
                    const retry = (err?.body?.retry_after || 5) * 1000;
                    await new Promise(r => setTimeout(r, retry));
                    return await http.del({ url: `/users/@me/guilds/${guildId}` });
                }
                throw err;
            }
        }

        const token = getDiscordToken();
        if (token) {
            const res = await fetch(`https://discord.com/api/v9/users/@me/guilds/${guildId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 429) {
                const data = await res.json().catch(() => ({}));
                const retry = ((data && data.retry_after) || 5) * 1000;
                await new Promise(r => setTimeout(r, retry));
                return await apiLeaveGuild(guildId);
            }

            if (!res.ok && res.status !== 204) {
                const errText = await res.text().catch(() => "");
                throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`);
            }

            return true;
        }

        throw new Error("Action introuvable.");
    }

    async function apiMarkAsRead(guildId) {
        const ack = getAckActions();
        if (ack && typeof ack.ackGuild === "function") {
            return await ack.ackGuild(guildId);
        }
        const http = getHttpModule();
        if (http && typeof http.post === "function") {
            return await http.post({ url: `/guilds/${guildId}/ack` });
        }
        const token = getDiscordToken();
        if (token) {
            return await fetch(`https://discord.com/api/v9/guilds/${guildId}/ack`, {
                method: "POST",
                headers: { "Authorization": token }
            });
        }
    }

    async function apiSetMute(guildId, muted) {
        const settings = getSettingsActions();
        if (settings && typeof settings.updateGuildNotificationSettings === "function") {
            return await settings.updateGuildNotificationSettings(guildId, { muted: !!muted });
        }
        const http = getHttpModule();
        if (http && typeof http.patch === "function") {
            return await http.patch({
                url: `/users/@me/guilds/${guildId}/settings`,
                body: { muted: !!muted }
            });
        }
    }

    // Récupération des données
    function fetchGuildData() {
        const UserStore = getUserStore();
        const GuildStore = getGuildStore();
        const SortedGuildStore = getSortedGuildStore();

        const currentUserId = UserStore?.getCurrentUser?.()?.id;
        const allGuilds = GuildStore?.getGuilds?.() || {};
        const folders = SortedGuildStore?.getCompatibleGuildFolders?.() ||
                        SortedGuildStore?.getGuildFolders?.() || [];

        const folderMap = new Map();
        for (const folder of folders) {
            if (!folder || !folder.guildIds) continue;
            const fid = folder.folderId != null ? String(folder.folderId) : (folder.id != null ? String(folder.id) : null);
            for (const gid of folder.guildIds) {
                folderMap.set(gid, {
                    folderId: fid,
                    folderName: folder.folderName || folder.name || (fid ? `Dossier ${fid}` : null),
                    folderColor: folder.folderColor || folder.color || null
                });
            }
        }

        const guildsList = Object.values(allGuilds).map(g => {
            const folderInfo = folderMap.get(g.id);
            const isOwner = currentUserId ? g.ownerId === currentUserId : false;
            return {
                id: g.id,
                name: g.name,
                icon: g.icon,
                iconUrl: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp?size=64` : null,
                acronym: g.acronym || getAcronym(g.name),
                ownerId: g.ownerId,
                isOwner,
                folderId: folderInfo?.folderId || null,
                folderName: folderInfo?.folderName || null,
                folderColor: folderInfo?.folderColor || null
            };
        });

        const distinctFolders = [];
        const seenFolderIds = new Set();
        for (const folder of folders) {
            const fid = folder.folderId != null ? String(folder.folderId) : (folder.id != null ? String(folder.id) : null);
            if (fid && !seenFolderIds.has(fid)) {
                seenFolderIds.add(fid);
                distinctFolders.push({
                    id: fid,
                    name: folder.folderName || folder.name || `Dossier ${fid}`,
                    color: folder.folderColor || folder.color || null,
                    count: folder.guildIds ? folder.guildIds.length : 0
                });
            }
        }

        return { guilds: guildsList, folders: distinctFolders, currentUserId };
    }

    function extractFolderGuildIds(props) {
        if (props?.guildIds && Array.isArray(props.guildIds) && props.guildIds.length > 0) {
            return props.guildIds;
        }
        const SortedGuildStore = getSortedGuildStore();
        const folders = SortedGuildStore?.getCompatibleGuildFolders?.() ||
                        SortedGuildStore?.getGuildFolders?.() || [];
        const fid = props?.folderId ?? props?.id ?? props?.folderNode?.id;
        if (fid != null) {
            const found = folders.find(f => (f.folderId != null && String(f.folderId) === String(fid)) || (f.id != null && String(f.id) === String(fid)));
            if (found?.guildIds) return found.guildIds;
        }
        if (props?.folderNode?.children && Array.isArray(props.folderNode.children)) {
            return props.folderNode.children.map(c => c.id || c.guildId).filter(Boolean);
        }
        if (props?.target && typeof props.target.closest === "function") {
            const folderEl = props.target.closest("[data-folder-id]");
            if (folderEl) {
                const attrId = folderEl.getAttribute("data-folder-id");
                if (attrId) {
                    const found = folders.find(f => String(f.folderId || f.id) === String(attrId));
                    if (found?.guildIds) return found.guildIds;
                }
            }
        }
        return [];
    }

    function extractFolderName(props, guildIds) {
        if (props?.folderName) return props.folderName;
        const SortedGuildStore = getSortedGuildStore();
        const folders = SortedGuildStore?.getCompatibleGuildFolders?.() ||
                        SortedGuildStore?.getGuildFolders?.() || [];
        const fid = props?.folderId ?? props?.id ?? props?.folderNode?.id;
        if (fid != null) {
            const found = folders.find(f => (f.folderId != null && String(f.folderId) === String(fid)) || (f.id != null && String(f.id) === String(fid)));
            if (found?.folderName) return found.folderName;
        }
        return `Dossier (${guildIds.length} serveurs)`;
    }

    function insertIntoMenu(menu, items) {
        if (!menu || !menu.props) return;
        if (!menu.props.children) {
            menu.props.children = [];
        } else if (!Array.isArray(menu.props.children)) {
            menu.props.children = [menu.props.children];
        }

        const MenuComponents = findByKeys("MenuGroup", "MenuItem");
        if (MenuComponents && MenuComponents.MenuGroup) {
            menu.props.children.push(BdApi.React.createElement(MenuComponents.MenuGroup, {}, ...items));
        } else {
            menu.props.children.push(...items);
        }
    }

    // Modal
    let activeModalUnmount = null;

    function closeModal() {
        if (activeModalUnmount) {
            activeModalUnmount();
            activeModalUnmount = null;
        }
        const container = document.getElementById(CONTAINER_ID);
        if (container) {
            container.remove();
        }
    }

    function mountModal(reactElement) {
        closeModal();
        let container = document.getElementById(CONTAINER_ID);
        if (!container) {
            container = document.createElement("div");
            container.id = CONTAINER_ID;
            document.body.appendChild(container);
        }

        if (BdApi.ReactDOM && BdApi.ReactDOM.createRoot) {
            const root = BdApi.ReactDOM.createRoot(container);
            root.render(reactElement);
            activeModalUnmount = () => root.unmount();
        } else if (BdApi.ReactDOM && BdApi.ReactDOM.render) {
            BdApi.ReactDOM.render(reactElement, container);
            activeModalUnmount = () => BdApi.ReactDOM.unmountComponentAtNode(container);
        }
    }

    function DiscordCheckbox({ checked, onChange }) {
        const React = BdApi.React;
        return React.createElement("div", {
            className: `gbm-checkbox ${checked ? "checked" : ""}`,
            onClick: (e) => {
                e.stopPropagation();
                onChange();
            }
        },
            checked && React.createElement("svg", {
                width: "12",
                height: "12",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "3.5",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            },
                React.createElement("polyline", { points: "20 6 9 17 4 12" })
            )
        );
    }

    // Composant Principal
    function BulkManagerApp(props) {
        const React = BdApi.React;
        const { useState, useEffect, useMemo, useRef } = React;

        const [lang, setLang] = useState(detectLocale);
        const [data, setData] = useState(() => fetchGuildData());
        const [search, setSearch] = useState("");
        const [activeTab, setActiveTab] = useState(props.initialFolderId ? "FOLDER" : "ALL");
        const [folderFilter, setFolderFilter] = useState(props.initialFolderId ? String(props.initialFolderId) : "ALL");
        const [selectedIds, setSelectedIds] = useState(() => {
            if (props.preselectedGuildIds && Array.isArray(props.preselectedGuildIds)) {
                return new Set(props.preselectedGuildIds);
            }
            return new Set();
        });
        const [delaySec, setDelaySec] = useState(1.5);
        const [shortcutText, setShortcutText] = useState(() => formatShortcut(loadShortcut()));

        const [taskRunning, setTaskRunning] = useState(false);
        const [taskType, setTaskType] = useState(null);
        const [taskProgress, setTaskProgress] = useState({ current: 0, total: 0, currentGuild: "", percent: 0, successCount: 0, errorCount: 0 });
        const [taskLogs, setTaskLogs] = useState([]);
        const [taskDone, setTaskDone] = useState(false);
        const abortRef = useRef(false);
        const logsEndRef = useRef(null);

        const [confirmDialog, setConfirmDialog] = useState(null);

        const t = getStrings(lang);

        const handleLanguageChange = (newLang) => {
            setLang(newLang);
            try {
                window.localStorage?.setItem(STORAGE_KEY_LOCALE, newLang);
            } catch (e) {}
        };

        const reload = () => {
            setData(fetchGuildData());
        };

        useEffect(() => {
            if (logsEndRef.current) {
                logsEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, [taskLogs]);

        useEffect(() => {
            if (props.autoStartAction === "LEAVE" && props.preselectedGuildIds && props.preselectedGuildIds.length > 0) {
                const targetGuilds = data.guilds.filter(g => props.preselectedGuildIds.includes(g.id) && !g.isOwner);
                if (targetGuilds.length > 0) {
                    runBulkAction("LEAVE", targetGuilds);
                }
            }
        }, []);

        const filteredGuilds = useMemo(() => {
            return data.guilds.filter(g => {
                if (search.trim()) {
                    const q = search.toLowerCase().trim();
                    if (!g.name.toLowerCase().includes(q)) return false;
                }
                if (activeTab === "NO_FOLDER" && g.folderId != null) return false;
                if (activeTab === "OWNED" && !g.isOwner) return false;
                if (activeTab === "FOLDER" && folderFilter !== "ALL") {
                    if (String(g.folderId) !== String(folderFilter)) return false;
                }
                return true;
            });
        }, [data.guilds, search, activeTab, folderFilter]);

        const toggleSelect = (id) => {
            if (taskRunning) return;
            setSelectedIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        };

        const selectAllVisible = () => {
            if (taskRunning) return;
            setSelectedIds(prev => {
                const next = new Set(prev);
                for (const g of filteredGuilds) {
                    next.add(g.id);
                }
                return next;
            });
        };

        const deselectAll = () => {
            if (taskRunning) return;
            setSelectedIds(new Set());
        };

        const invertSelection = () => {
            if (taskRunning) return;
            setSelectedIds(prev => {
                const next = new Set();
                for (const g of filteredGuilds) {
                    if (!prev.has(g.id)) next.add(g.id);
                }
                return next;
            });
        };

        const selectedGuilds = useMemo(() => {
            return data.guilds.filter(g => selectedIds.has(g.id));
        }, [data.guilds, selectedIds]);

        const runBulkAction = async (type, targetGuilds) => {
            if (!targetGuilds || targetGuilds.length === 0) return;

            setTaskRunning(true);
            setTaskType(type);
            setTaskDone(false);
            setTaskLogs([]);
            abortRef.current = false;

            const total = targetGuilds.length;
            const addLog = (guildName, status, text) => {
                const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                setTaskLogs(prev => [...prev, { time, guildName, status, text }]);
            };

            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < total; i++) {
                if (abortRef.current) {
                    addLog("Operation", "warn", t.btnStop);
                    break;
                }

                const guild = targetGuilds[i];
                const currentNum = i + 1;
                const percent = Math.round((currentNum / total) * 100);

                setTaskProgress({
                    current: currentNum,
                    total,
                    currentGuild: guild.name,
                    percent,
                    successCount,
                    errorCount
                });

                try {
                    if (type === "LEAVE") {
                        if (guild.isOwner) {
                            addLog(guild.name, "warn", t.statusSkipped);
                            continue;
                        }
                        await apiLeaveGuild(guild.id);
                        addLog(guild.name, "success", t.statusQuit);
                        successCount++;
                    } else if (type === "ACK") {
                        await apiMarkAsRead(guild.id);
                        addLog(guild.name, "success", t.statusAcked);
                        successCount++;
                    } else if (type === "MUTE") {
                        await apiSetMute(guild.id, true);
                        addLog(guild.name, "success", t.statusMuted);
                        successCount++;
                    } else if (type === "UNMUTE") {
                        await apiSetMute(guild.id, false);
                        addLog(guild.name, "success", t.statusUnmuted);
                        successCount++;
                    }
                } catch (err) {
                    console.error("[BD-BulkOptions] Action error", guild.id, err);
                    addLog(guild.name, "error", err?.message || "Error");
                    errorCount++;
                }

                setTaskProgress(prev => ({
                    ...prev,
                    successCount,
                    errorCount
                }));

                if (i < total - 1 && !abortRef.current) {
                    const sleepTime = type === "ACK" ? 250 : delaySec * 1000;
                    await new Promise(r => setTimeout(r, sleepTime));
                }
            }

            setTaskDone(true);
            reload();

            if (type === "LEAVE") {
                setSelectedIds(prev => {
                    const next = new Set(prev);
                    targetGuilds.forEach(g => {
                        if (!g.isOwner) next.delete(g.id);
                    });
                    return next;
                });
            }
        };

        const stopTask = () => {
            abortRef.current = true;
        };

        const promptLeaveSelected = () => {
            if (selectedGuilds.length === 0) return;
            const validGuilds = selectedGuilds.filter(g => !g.isOwner);
            const ownedCount = selectedGuilds.length - validGuilds.length;

            setConfirmDialog({
                title: t.confirmLeaveTitle(validGuilds.length),
                description: t.confirmLeaveDesc,
                ownedWarning: ownedCount > 0 ? t.ownedWarning(ownedCount) : null,
                guilds: validGuilds,
                onConfirm: () => {
                    setConfirmDialog(null);
                    runBulkAction("LEAVE", validGuilds);
                }
            });
        };

        const countNoFolder = useMemo(() => data.guilds.filter(g => g.folderId == null).length, [data.guilds]);
        const countOwned = useMemo(() => data.guilds.filter(g => g.isOwner).length, [data.guilds]);

        return React.createElement("div", {
            className: "gbm-backdrop",
            onClick: (e) => {
                if (e.target === e.currentTarget && !taskRunning) {
                    closeModal();
                }
            }
        },
            React.createElement("div", { className: "gbm-modal" },
                // Header
                React.createElement("div", { className: "gbm-header" },
                    React.createElement("div", { className: "gbm-header-title" },
                        t.title,
                        React.createElement("span", { className: "gbm-header-count" }, `(${data.guilds.length})`)
                    ),
                    React.createElement("div", { className: "gbm-header-controls" },
                        // Sélecteur de langue
                        React.createElement("select", {
                            className: "gbm-lang-select",
                            value: lang,
                            onChange: (e) => handleLanguageChange(e.target.value)
                        },
                            React.createElement("option", { value: "fr" }, "FR"),
                            React.createElement("option", { value: "en" }, "EN"),
                            React.createElement("option", { value: "es" }, "ES"),
                            React.createElement("option", { value: "de" }, "DE")
                        ),
                        React.createElement("button", {
                            className: "gbm-close-btn",
                            title: t.btnClose,
                            disabled: taskRunning,
                            onClick: closeModal
                        },
                            React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
                                React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                                React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                            )
                        )
                    )
                ),

                // Filtres
                React.createElement("div", { className: "gbm-filter-bar" },
                    React.createElement("div", { className: "gbm-filter-row" },
                        React.createElement("div", { className: "gbm-search-box" },
                            React.createElement("svg", { className: "gbm-search-icon", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
                                React.createElement("circle", { cx: "11", cy: "11", r: "8" }),
                                React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                            ),
                            React.createElement("input", {
                                type: "text",
                                className: "gbm-search-input",
                                placeholder: t.searchPlaceholder,
                                value: search,
                                onChange: (e) => setSearch(e.target.value)
                            }),
                            search && React.createElement("button", {
                                className: "gbm-search-clear",
                                onClick: () => setSearch("")
                            },
                                React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
                                    React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                                    React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                                )
                            )
                        ),

                        activeTab === "FOLDER" && React.createElement("select", {
                            className: "gbm-select",
                            value: folderFilter,
                            onChange: (e) => setFolderFilter(e.target.value)
                        },
                            React.createElement("option", { value: "ALL" }, t.allFolders),
                            data.folders.map(f =>
                                React.createElement("option", { key: f.id, value: f.id }, `${f.name} (${f.count})`)
                            )
                        ),

                        React.createElement("select", {
                            className: "gbm-select",
                            value: delaySec,
                            onChange: (e) => setDelaySec(parseFloat(e.target.value))
                        },
                            React.createElement("option", { value: 1.0 }, `${t.delay} : 1.0s`),
                            React.createElement("option", { value: 1.5 }, `${t.delay} : 1.5s`),
                            React.createElement("option", { value: 2.0 }, `${t.delay} : 2.0s`),
                            React.createElement("option", { value: 3.0 }, `${t.delay} : 3.0s`)
                        )
                    ),

                    React.createElement("div", { className: "gbm-tabs-row" },
                        React.createElement("button", {
                            className: `gbm-tab-btn ${activeTab === "ALL" ? "active" : ""}`,
                            onClick: () => setActiveTab("ALL")
                        }, `${t.tabAll} (${data.guilds.length})`),

                        data.folders.length > 0 && React.createElement("button", {
                            className: `gbm-tab-btn ${activeTab === "FOLDER" ? "active" : ""}`,
                            onClick: () => setActiveTab("FOLDER")
                        }, `${t.tabFolders} (${data.folders.length})`),

                        React.createElement("button", {
                            className: `gbm-tab-btn ${activeTab === "NO_FOLDER" ? "active" : ""}`,
                            onClick: () => setActiveTab("NO_FOLDER")
                        }, `${t.tabNoFolder} (${countNoFolder})`),

                        countOwned > 0 && React.createElement("button", {
                            className: `gbm-tab-btn ${activeTab === "OWNED" ? "active" : ""}`,
                            onClick: () => setActiveTab("OWNED")
                        }, `${t.tabOwned} (${countOwned})`)
                    )
                ),

                // Actions
                React.createElement("div", { className: "gbm-actions-bar" },
                    React.createElement("div", { className: "gbm-selection-summary" },
                        React.createElement("button", {
                            className: "gbm-btn gbm-btn-link",
                            onClick: selectAllVisible,
                            disabled: taskRunning || filteredGuilds.length === 0
                        }, t.selectAll),
                        React.createElement("span", { style: { color: "rgba(255,255,255,0.2)" } }, "•"),
                        React.createElement("button", {
                            className: "gbm-btn gbm-btn-link",
                            onClick: deselectAll,
                            disabled: taskRunning || selectedIds.size === 0
                        }, t.deselectAll),
                        React.createElement("span", { style: { color: "rgba(255,255,255,0.2)" } }, "•"),
                        React.createElement("span", { className: "gbm-selection-count" },
                            t.selectedCount(selectedIds.size)
                        )
                    ),

                    React.createElement("div", { className: "gbm-btn-group" },
                        React.createElement("button", {
                            className: "gbm-btn gbm-btn-danger",
                            disabled: taskRunning || selectedGuilds.length === 0,
                            onClick: promptLeaveSelected
                        }, `${t.actionLeave} (${selectedGuilds.filter(g => !g.isOwner).length})`),

                        React.createElement("button", {
                            className: "gbm-btn gbm-btn-secondary",
                            disabled: taskRunning || selectedGuilds.length === 0,
                            onClick: () => runBulkAction("ACK", selectedGuilds)
                        }, t.actionAck),

                        React.createElement("button", {
                            className: "gbm-btn gbm-btn-secondary",
                            disabled: taskRunning || selectedGuilds.length === 0,
                            onClick: () => runBulkAction("MUTE", selectedGuilds)
                        }, t.actionMute),

                        React.createElement("button", {
                            className: "gbm-btn gbm-btn-secondary",
                            disabled: taskRunning || selectedGuilds.length === 0,
                            onClick: () => runBulkAction("UNMUTE", selectedGuilds)
                        }, t.actionUnmute)
                    )
                ),

                // Liste
                React.createElement("div", { className: "gbm-list-container" },
                    filteredGuilds.length === 0 ?
                        React.createElement("div", { style: { textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13 } },
                            t.emptySearch
                        ) :
                        filteredGuilds.map(guild => {
                            const isSelected = selectedIds.has(guild.id);
                            return React.createElement("div", {
                                key: guild.id,
                                className: `gbm-guild-row ${isSelected ? "selected" : ""}`,
                                onClick: () => toggleSelect(guild.id)
                            },
                                React.createElement(DiscordCheckbox, {
                                    checked: isSelected,
                                    onChange: () => toggleSelect(guild.id)
                                }),

                                guild.iconUrl ?
                                    React.createElement("img", {
                                        src: guild.iconUrl,
                                        className: "gbm-guild-icon",
                                        alt: guild.name
                                    }) :
                                    React.createElement("div", {
                                        className: "gbm-guild-icon"
                                    }, guild.acronym),

                                React.createElement("div", { className: "gbm-guild-info" },
                                    React.createElement("div", { className: "gbm-guild-name" }, guild.name),
                                    React.createElement("div", { className: "gbm-guild-meta" },
                                        guild.folderName && React.createElement("span", {
                                            className: "gbm-badge gbm-badge-folder",
                                            style: { borderLeftColor: colorToHex(guild.folderColor) }
                                        }, guild.folderName),

                                        guild.isOwner && React.createElement("span", {
                                            className: "gbm-badge gbm-badge-owner"
                                        }, t.ownerBadge),

                                        React.createElement("span", { style: { fontFamily: "monospace" } }, guild.id)
                                    )
                                )
                            );
                        })
                ),

                // Footer
                React.createElement("div", { className: "gbm-footer" },
                    React.createElement("span", {},
                        `${filteredGuilds.length} / ${data.guilds.length}`
                    ),
                    React.createElement("div", { className: "gbm-shortcut-hint" },
                        `${t.shortcutHint} `,
                        React.createElement("kbd", {}, shortcutText)
                    )
                ),

                // Écran d'exécution
                taskRunning && React.createElement("div", { className: "gbm-exec-overlay" },
                    React.createElement("div", { className: "gbm-exec-header" },
                        React.createElement("div", { className: "gbm-exec-title" },
                            taskDone ? t.execDone : t.execRunning
                        ),
                        React.createElement("div", { className: "gbm-exec-status" },
                            `${taskProgress.current} / ${taskProgress.total} (${taskProgress.percent}%)`
                        )
                    ),

                    React.createElement("div", { className: "gbm-exec-body" },
                        React.createElement("div", { className: "gbm-progress-track" },
                            React.createElement("div", {
                                className: `gbm-progress-fill ${taskType === "LEAVE" ? "danger" : ""}`,
                                style: { width: `${taskProgress.percent}%` }
                            })
                        ),

                        React.createElement("div", { className: "gbm-exec-metrics" },
                            React.createElement("span", {},
                                `${t.current} : `,
                                React.createElement("span", { className: "gbm-exec-metrics-strong" },
                                    taskDone ? t.execDone : (taskProgress.currentGuild || "...")
                                )
                            ),
                            React.createElement("span", {},
                                React.createElement("span", { style: { color: "var(--status-positive, #23a55a)", marginRight: 12 } },
                                    t.statusSuccess(taskProgress.successCount)
                                ),
                                taskProgress.errorCount > 0 && React.createElement("span", { style: { color: "var(--status-danger, #da373c)" } },
                                    t.statusError(taskProgress.errorCount)
                                )
                            )
                        ),

                        React.createElement("div", { className: "gbm-log-list" },
                            taskLogs.map((log, index) =>
                                React.createElement("div", {
                                    key: index,
                                    className: `gbm-log-row ${log.status}`
                                },
                                    React.createElement("div", { className: "gbm-log-status-dot" }),
                                    React.createElement("span", { className: "gbm-log-target" }, log.guildName),
                                    React.createElement("span", { className: "gbm-log-message" }, log.text),
                                    React.createElement("span", { className: "gbm-log-time" }, log.time)
                                )
                            ),
                            React.createElement("div", { ref: logsEndRef })
                        )
                    ),

                    React.createElement("div", { className: "gbm-exec-footer" },
                        React.createElement("span", { style: { fontSize: 12.5, color: "var(--text-muted)" } },
                            t.activeRateLimit
                        ),

                        !taskDone ?
                            React.createElement("button", {
                                className: "gbm-btn gbm-btn-danger",
                                onClick: stopTask
                            }, t.btnStop) :
                            React.createElement("button", {
                                className: "gbm-btn gbm-btn-primary",
                                onClick: () => {
                                    setTaskRunning(false);
                                    setTaskDone(false);
                                }
                            }, t.btnClose)
                    )
                ),

                // Confirmation
                confirmDialog && React.createElement("div", {
                    className: "gbm-backdrop",
                    style: { zIndex: 10001 }
                },
                    React.createElement("div", { className: "gbm-confirm-dialog" },
                        React.createElement("div", { className: "gbm-confirm-title" }, confirmDialog.title),
                        React.createElement("div", { className: "gbm-confirm-desc" }, confirmDialog.description),
                        confirmDialog.ownedWarning && React.createElement("div", {
                            style: { background: "rgba(240, 178, 50, 0.1)", borderLeft: "3px solid #f0b232", padding: "8px 12px", fontSize: 12, color: "#dbdee1" }
                        }, confirmDialog.ownedWarning),

                        React.createElement("div", { className: "gbm-confirm-list" },
                            confirmDialog.guilds.map(g =>
                                React.createElement("div", { key: g.id, style: { display: "flex", justifyContent: "space-between", padding: "2px 0" } },
                                    React.createElement("span", { style: { color: "var(--header-primary)" } }, g.name),
                                    React.createElement("span", { style: { color: "var(--text-muted)", fontFamily: "monospace", fontSize: 11 } }, g.id)
                                )
                            )
                        ),

                        React.createElement("div", { className: "gbm-confirm-actions" },
                            React.createElement("button", {
                                className: "gbm-btn gbm-btn-secondary",
                                onClick: () => setConfirmDialog(null)
                            }, t.btnCancel),
                            React.createElement("button", {
                                className: "gbm-btn gbm-btn-danger",
                                onClick: confirmDialog.onConfirm
                            }, t.btnConfirm)
                        )
                    )
                )
            )
        );
    }

    // Modal rapide dossier
    function promptLeaveEntireFolder(guildIds, folderName) {
        const lang = detectLocale();
        const t = getStrings(lang);

        if (!guildIds || guildIds.length === 0) {
            BdApi.UI.showToast(t.folderEmptyToast, { type: "info" });
            return;
        }

        const React = BdApi.React;
        const UserStore = getUserStore();
        const GuildStore = getGuildStore();

        const currentUserId = UserStore?.getCurrentUser?.()?.id;
        const allGuilds = GuildStore?.getGuilds?.() || {};

        const folderGuilds = guildIds.map(id => allGuilds[id]).filter(Boolean);
        const validGuilds = folderGuilds.filter(g => !currentUserId || g.ownerId !== currentUserId);
        const ownedGuilds = folderGuilds.filter(g => currentUserId && g.ownerId === currentUserId);

        function FolderLeaveConfirmApp() {
            const [delay, setDelay] = React.useState(1.5);

            return React.createElement("div", {
                className: "gbm-backdrop",
                onClick: (e) => {
                    if (e.target === e.currentTarget) closeModal();
                }
            },
                React.createElement("div", { className: "gbm-confirm-dialog", style: { width: 500 } },
                    React.createElement("div", { className: "gbm-confirm-title" },
                        t.confirmLeaveFolderTitle(folderName)
                    ),
                    React.createElement("div", { className: "gbm-confirm-desc" },
                        t.confirmLeaveFolderDesc(validGuilds.length)
                    ),

                    ownedGuilds.length > 0 && React.createElement("div", {
                        style: { background: "rgba(240, 178, 50, 0.1)", borderLeft: "3px solid #f0b232", padding: "8px 12px", fontSize: 12, color: "#dbdee1" }
                    },
                        t.ownedWarning(ownedGuilds.length)
                    ),

                    React.createElement("div", { className: "gbm-confirm-list", style: { maxHeight: 160 } },
                        validGuilds.map(g =>
                            React.createElement("div", { key: g.id, style: { display: "flex", justifyContent: "space-between", padding: "2px 0" } },
                                React.createElement("span", { style: { color: "var(--header-primary)" } }, g.name),
                                React.createElement("span", { style: { color: "var(--text-muted)", fontFamily: "monospace", fontSize: 11 } }, g.id)
                            )
                        )
                    ),

                    React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 } },
                        React.createElement("span", { style: { fontSize: 12.5, color: "var(--text-muted)" } },
                            `${t.delay} :`
                        ),
                        React.createElement("select", {
                            className: "gbm-select",
                            value: delay,
                            onChange: (e) => setDelay(parseFloat(e.target.value))
                        },
                            React.createElement("option", { value: 1.0 }, "1.0s"),
                            React.createElement("option", { value: 1.5 }, "1.5s"),
                            React.createElement("option", { value: 2.0 }, "2.0s")
                        )
                    ),

                    React.createElement("div", { className: "gbm-confirm-actions" },
                        React.createElement("button", {
                            className: "gbm-btn gbm-btn-secondary",
                            onClick: closeModal
                        }, t.btnCancel),

                        React.createElement("button", {
                            className: "gbm-btn gbm-btn-danger",
                            onClick: () => {
                                mountModal(React.createElement(BulkManagerApp, {
                                    initialFolderId: null,
                                    preselectedGuildIds: validGuilds.map(g => g.id),
                                    autoStartAction: "LEAVE"
                                }));
                            }
                        }, `${t.actionLeave} (${validGuilds.length})`)
                    )
                )
            );
        }

        mountModal(BdApi.React.createElement(FolderLeaveConfirmApp, {}));
    }

    // Gestionnaire du plugin
    return class GuildBulkManager {
        constructor() {
            this.unpatchContextMenu = [];
            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.shortcut = loadShortcut();
        }

        start() {
            this.shortcut = loadShortcut();
            BdApi.DOM.addStyle(CSS_ID, STYLES);
            window.addEventListener("keydown", this.handleKeyDown);
            this.patchContextMenus();
            console.log("[BD-BulkOptions] Plugin started.");
        }

        stop() {
            BdApi.DOM.removeStyle(CSS_ID);
            window.removeEventListener("keydown", this.handleKeyDown);
            closeModal();

            for (const unpatch of this.unpatchContextMenu) {
                try {
                    if (typeof unpatch === "function") unpatch();
                } catch (e) {}
            }
            this.unpatchContextMenu = [];

            console.log("[BD-BulkOptions] Plugin stopped.");
        }

        handleKeyDown(e) {
            // Toujours recharger le raccourci actif
            const s = this.shortcut || loadShortcut();
            const matchesCtrl = !!s.ctrl === (e.ctrlKey || e.metaKey);
            const matchesAlt = !!s.alt === e.altKey;
            const matchesShift = !!s.shift === e.shiftKey;
            const matchesKey = e.key && s.key && (e.key.toLowerCase() === s.key.toLowerCase());

            if (matchesCtrl && matchesAlt && matchesShift && matchesKey) {
                e.preventDefault();
                this.openModal();
            }
        }

        openModal(options = {}) {
            mountModal(BdApi.React.createElement(BulkManagerApp, options));
        }

        patchContextMenus() {
            const lang = detectLocale();
            const t = getStrings(lang);

            try {
                const unpatchFolder = BdApi.ContextMenu.patch("guild-folder-context", (menu, props) => {
                    const guildIds = extractFolderGuildIds(props);
                    if (!guildIds || guildIds.length === 0) return;

                    const folderName = extractFolderName(props, guildIds);

                    const folderItems = [
                        BdApi.ContextMenu.buildItem({
                            type: "separator"
                        }),
                        BdApi.ContextMenu.buildItem({
                            id: "gbm-folder-leave-all",
                            label: t.contextMenuLeaveFolder(guildIds.length),
                            danger: true,
                            action: () => {
                                promptLeaveEntireFolder(guildIds, folderName);
                            }
                        }),
                        BdApi.ContextMenu.buildItem({
                            id: "gbm-folder-manage-bulk",
                            label: t.contextMenuManageFolder,
                            action: () => {
                                const folderId = props?.folderId ?? props?.id ?? props?.folderNode?.id;
                                this.openModal({ initialFolderId: folderId, preselectedGuildIds: guildIds });
                            }
                        })
                    ];

                    insertIntoMenu(menu, folderItems);
                });

                if (typeof unpatchFolder === "function") {
                    this.unpatchContextMenu.push(unpatchFolder);
                }
            } catch (err) {
                console.error("[BD-BulkOptions] Error patching guild-folder-context", err);
            }

            try {
                const unpatchGuild = BdApi.ContextMenu.patch("guild-context", (menu, props) => {
                    const guildId = props?.guild?.id || props?.guildId;

                    const bulkItems = [
                        BdApi.ContextMenu.buildItem({
                            type: "separator"
                        }),
                        BdApi.ContextMenu.buildItem({
                            id: "gbm-open-manager",
                            label: t.contextMenuManageServer,
                            action: () => {
                                this.openModal({
                                    preselectedGuildIds: guildId ? [guildId] : []
                                });
                            }
                        })
                    ];

                    insertIntoMenu(menu, bulkItems);
                });

                if (typeof unpatchGuild === "function") {
                    this.unpatchContextMenu.push(unpatchGuild);
                }
            } catch (err) {
                console.error("[BD-BulkOptions] Error patching guild-context", err);
            }
        }

        getSettingsPanel() {
            const lang = detectLocale();
            const t = getStrings(lang);
            let currentShortcut = loadShortcut();

            const panel = document.createElement("div");
            panel.style.padding = "16px";
            panel.style.color = "var(--text-normal, #dbdee1)";
            panel.style.fontSize = "13.5px";
            panel.style.display = "flex";
            panel.style.flexDirection = "column";
            panel.style.gap = "18px";

            panel.innerHTML = `
                <div>
                    <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px; color: var(--header-primary, #f2f3f5);">BD-BulkOptions</div>
                    <div style="color: var(--text-muted, #949ba4); font-size: 13px;">${t.title}</div>
                </div>

                <div style="background: var(--background-secondary, #2b2d31); padding: 14px 16px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.06); display: flex; flex-direction: column; gap: 10px;">
                    <div>
                        <div style="font-weight: 600; color: var(--header-primary, #f2f3f5); font-size: 13.5px;">${t.settingsShortcutTitle}</div>
                        <div style="color: var(--text-muted, #949ba4); font-size: 12.5px; margin-top: 2px;">${t.settingsShortcutDesc}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
                        <kbd id="gbm-shortcut-display" style="background: var(--background-tertiary, #1e1f22); padding: 6px 12px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); color: var(--header-primary, #f2f3f5); font-weight: 600; font-size: 13px; font-family: monospace;">
                            ${formatShortcut(currentShortcut)}
                        </kbd>
                        <button id="gbm-record-shortcut-btn" style="
                            background: var(--brand-experiment, #5865f2);
                            color: white;
                            border: none;
                            padding: 6px 12px;
                            border-radius: 4px;
                            font-size: 12.5px;
                            font-weight: 500;
                            cursor: pointer;
                        ">
                            ${t.settingsShortcutRecord}
                        </button>
                        <button id="gbm-reset-shortcut-btn" style="
                            background: var(--background-tertiary, #1e1f22);
                            color: var(--text-normal, #dbdee1);
                            border: 1px solid rgba(255,255,255,0.08);
                            padding: 6px 12px;
                            border-radius: 4px;
                            font-size: 12.5px;
                            cursor: pointer;
                        ">
                            ${t.settingsShortcutReset}
                        </button>
                    </div>
                </div>

                <div>
                    <button id="gbm-open-settings-btn" style="
                        background: var(--brand-experiment, #5865f2);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                    ">
                        ${t.settingsOpenBtn}
                    </button>
                </div>
            `;

            const displayEl = panel.querySelector("#gbm-shortcut-display");
            const recordBtn = panel.querySelector("#gbm-record-shortcut-btn");
            const resetBtn = panel.querySelector("#gbm-reset-shortcut-btn");
            const openBtn = panel.querySelector("#gbm-open-settings-btn");

            let isRecording = false;

            const onKeyRecord = (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Ignorer si c'est seulement une touche modificatrice isolée
                if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) {
                    displayEl.innerText = t.settingsShortcutRecording;
                    return;
                }

                const newShortcut = {
                    ctrl: e.ctrlKey || e.metaKey,
                    alt: e.altKey,
                    shift: e.shiftKey,
                    key: e.key.toLowerCase()
                };

                saveShortcut(newShortcut);
                this.shortcut = newShortcut;
                currentShortcut = newShortcut;
                displayEl.innerText = formatShortcut(newShortcut);

                window.removeEventListener("keydown", onKeyRecord, true);
                recordBtn.innerText = t.settingsShortcutRecord;
                recordBtn.style.background = "var(--brand-experiment, #5865f2)";
                isRecording = false;
            };

            recordBtn.addEventListener("click", () => {
                if (isRecording) {
                    window.removeEventListener("keydown", onKeyRecord, true);
                    recordBtn.innerText = t.settingsShortcutRecord;
                    recordBtn.style.background = "var(--brand-experiment, #5865f2)";
                    displayEl.innerText = formatShortcut(currentShortcut);
                    isRecording = false;
                } else {
                    isRecording = true;
                    recordBtn.innerText = t.btnCancel;
                    recordBtn.style.background = "var(--status-danger, #da373c)";
                    displayEl.innerText = t.settingsShortcutRecording;
                    window.addEventListener("keydown", onKeyRecord, true);
                }
            });

            resetBtn.addEventListener("click", () => {
                if (isRecording) {
                    window.removeEventListener("keydown", onKeyRecord, true);
                    recordBtn.innerText = t.settingsShortcutRecord;
                    recordBtn.style.background = "var(--brand-experiment, #5865f2)";
                    isRecording = false;
                }
                const reset = { ...DEFAULT_SHORTCUT };
                saveShortcut(reset);
                this.shortcut = reset;
                currentShortcut = reset;
                displayEl.innerText = formatShortcut(reset);
            });

            openBtn.addEventListener("click", () => {
                this.openModal();
            });

            return panel;
        }
    };
})();
