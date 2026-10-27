/*
 * Vencord Plugin - BulkOptions
 * Copyright (c) 2026 Mathilde
 * Licensed under the MIT License
 */

import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { patch } from "@api/ContextMenu";
import { openModal } from "@utils/modal";
import { showToast } from "@ui/toasts";
import { findByPropsLazy } from "@webpack";
import {
    GuildStore,
    SortedGuildStore,
    UserStore,
    Menu,
    React,
    ModalRoot,
    ModalSize
} from "@webpack/common";
import "./style.css";

// Actions Webpack Discord
const GuildActions = findByPropsLazy("leaveGuild");
const AckActions = findByPropsLazy("ackGuild", "bulkAck");
const NotificationSettings = findByPropsLazy("updateGuildNotificationSettings");
const RestAPI = findByPropsLazy("del", "post", "get");

// Paramètres Vencord
const settings = definePluginSettings({
    delay: {
        type: OptionType.SELECT,
        description: "Délai anti-rate limit entre chaque serveur / Delay between actions",
        options: [
            { label: "1.0s (Rapide / Fast)", value: 1.0 },
            { label: "1.5s (Recommandé / Recommended)", value: 1.5, default: true },
            { label: "2.0s (Sécurisé / Safe)", value: 2.0 },
            { label: "3.0s (Ultra-sûr / Extra Safe)", value: 3.0 }
        ]
    },
    shortcut: {
        type: OptionType.STRING,
        description: "Raccourci clavier / Keyboard shortcut (ex: Ctrl+Alt+B)",
        default: "Ctrl+Alt+B"
    },
    language: {
        type: OptionType.SELECT,
        description: "Langue de l'interface / Interface language",
        options: [
            { label: "Automatique (Discord)", value: "auto", default: true },
            { label: "Français", value: "fr" },
            { label: "English", value: "en" },
            { label: "Español", value: "es" },
            { label: "Deutsch", value: "de" }
        ]
    }
});

// Traductions i18n
const TRANSLATIONS: Record<string, any> = {
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
        selectedCount: (n: number) => `${n} sélectionné(s)`,
        actionLeave: "Quitter",
        actionAck: "Marquer comme lu",
        actionMute: "Muter",
        actionUnmute: "Démuter",
        ownerBadge: "Propriétaire",
        emptySearch: "Aucun serveur ne correspond aux critères de recherche.",
        execRunning: "Exécution en cours...",
        execDone: "Opération terminée",
        current: "En cours",
        statusSuccess: (n: number) => `${n} réussi(s)`,
        statusError: (n: number) => `${n} échec(s)`,
        statusSkipped: "Ignoré (propriétaire)",
        statusQuit: "Quitté",
        statusAcked: "Marqué comme lu",
        statusMuted: "Sourdine activée",
        statusUnmuted: "Sourdine désactivée",
        btnStop: "Interrompre",
        btnClose: "Fermer",
        btnCancel: "Annuler",
        btnConfirm: "Confirmer",
        confirmLeaveTitle: (n: number) => `Quitter ${n} serveur(s)`,
        confirmLeaveDesc: "Voulez-vous vraiment quitter ces serveurs ? Cette action est irréversible.",
        confirmLeaveFolderTitle: (name: string) => `Quitter le dossier "${name}"`,
        confirmLeaveFolderDesc: (n: number) => `Vous allez quitter ${n} serveur(s) de ce dossier.`,
        ownedWarning: (n: number) => `${n} serveur(s) dont vous êtes propriétaire seront ignorés.`,
        shortcutHint: "Raccourci :",
        contextMenuLeaveFolder: (n: number) => `Quitter le dossier (${n} serveurs)`,
        contextMenuManageFolder: "Gérer ce dossier...",
        contextMenuManageServer: "Gestionnaire de serveurs...",
        folderEmptyToast: "Ce dossier est vide.",
        activeRateLimit: "Temporisation de sécurité active"
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
        selectedCount: (n: number) => `${n} selected`,
        actionLeave: "Leave",
        actionAck: "Mark as read",
        actionMute: "Mute",
        actionUnmute: "Unmute",
        ownerBadge: "Owner",
        emptySearch: "No servers match the search criteria.",
        execRunning: "Execution in progress...",
        execDone: "Operation completed",
        current: "Current",
        statusSuccess: (n: number) => `${n} succeeded`,
        statusError: (n: number) => `${n} failed`,
        statusSkipped: "Skipped (owner)",
        statusQuit: "Left",
        statusAcked: "Marked as read",
        statusMuted: "Muted",
        statusUnmuted: "Unmuted",
        btnStop: "Stop",
        btnClose: "Close",
        btnCancel: "Cancel",
        btnConfirm: "Confirm",
        confirmLeaveTitle: (n: number) => `Leave ${n} server(s)`,
        confirmLeaveDesc: "Are you sure you want to leave these servers? This action cannot be undone.",
        confirmLeaveFolderTitle: (name: string) => `Leave folder "${name}"`,
        confirmLeaveFolderDesc: (n: number) => `You are about to leave ${n} server(s) in this folder.`,
        ownedWarning: (n: number) => `${n} server(s) where you are the owner will be skipped.`,
        shortcutHint: "Shortcut:",
        contextMenuLeaveFolder: (n: number) => `Leave folder (${n} servers)`,
        contextMenuManageFolder: "Manage this folder...",
        contextMenuManageServer: "Server Manager...",
        folderEmptyToast: "Folder is empty.",
        activeRateLimit: "Rate-limit safety delay active"
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
        selectedCount: (n: number) => `${n} seleccionado(s)`,
        actionLeave: "Salir",
        actionAck: "Marcar leído",
        actionMute: "Silenciar",
        actionUnmute: "Reactivar",
        ownerBadge: "Propietario",
        emptySearch: "Ningún servidor coincide con los filtros.",
        execRunning: "Ejecución en curso...",
        execDone: "Operación completada",
        current: "En curso",
        statusSuccess: (n: number) => `${n} éxito(s)`,
        statusError: (n: number) => `${n} error(es)`,
        statusSkipped: "Ignorado (propietario)",
        statusQuit: "Salido",
        statusAcked: "Marcado leído",
        statusMuted: "Silenciado",
        statusUnmuted: "Reactivado",
        btnStop: "Detener",
        btnClose: "Cerrar",
        btnCancel: "Cancelar",
        btnConfirm: "Confirmar",
        confirmLeaveTitle: (n: number) => `Salir de ${n} servidor(es)`,
        confirmLeaveDesc: "¿Seguro que quieres salir de estos servidores?",
        confirmLeaveFolderTitle: (name: string) => `Salir de la carpeta "${name}"`,
        confirmLeaveFolderDesc: (n: number) => `Vas a salir de ${n} servidor(es) de esta carpeta.`,
        ownedWarning: (n: number) => `${n} servidor(es) donde eres propietario serán ignorados.`,
        shortcutHint: "Atajo:",
        contextMenuLeaveFolder: (n: number) => `Salir de la carpeta (${n} servidores)`,
        contextMenuManageFolder: "Gestionar esta carpeta...",
        contextMenuManageServer: "Gestor de servidores...",
        folderEmptyToast: "Carpeta vacía.",
        activeRateLimit: "Pausa de seguridad activa"
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
        selectedCount: (n: number) => `${n} ausgewählt`,
        actionLeave: "Verlassen",
        actionAck: "Als gelesen markieren",
        actionMute: "Stummschalten",
        actionUnmute: "Entstummen",
        ownerBadge: "Besitzer",
        emptySearch: "Keine Server entsprechen den Suchkriterien.",
        execRunning: "Ausführung läuft...",
        execDone: "Vorgang abgeschlossen",
        current: "Aktuell",
        statusSuccess: (n: number) => `${n} erfolgreich`,
        statusError: (n: number) => `${n} fehlgeschlagen`,
        statusSkipped: "Übersprungen (Besitzer)",
        statusQuit: "Verlassen",
        statusAcked: "Gelesen",
        statusMuted: "Stummgeschaltet",
        statusUnmuted: "Entstummt",
        btnStop: "Abbrechen",
        btnClose: "Schließen",
        btnCancel: "Abbrechen",
        btnConfirm: "Bestätigen",
        confirmLeaveTitle: (n: number) => `${n} Server verlassen`,
        confirmLeaveDesc: "Möchtest du diese Server wirklich verlassen?",
        confirmLeaveFolderTitle: (name: string) => `Ordner "${name}" verlassen`,
        confirmLeaveFolderDesc: (n: number) => `Du bist dabei, ${n} Server in diesem Ordner zu verlassen.`,
        ownedWarning: (n: number) => `${n} Server, deren Besitzer du bist, werden übersprungen.`,
        shortcutHint: "Kürzel:",
        contextMenuLeaveFolder: (n: number) => `Ordner verlassen (${n} Server)`,
        contextMenuManageFolder: "Diesen Ordner verwalten...",
        contextMenuManageServer: "Server-Manager...",
        folderEmptyToast: "Ordner ist leer.",
        activeRateLimit: "Sicherheitsverzögerung aktiv"
    }
};

function getActiveLocale(): string {
    const configured = settings.store.language;
    if (configured && configured !== "auto" && TRANSLATIONS[configured]) {
        return configured;
    }
    const raw = (document.documentElement.lang || navigator.language || "en").toLowerCase();
    if (raw.startsWith("fr")) return "fr";
    if (raw.startsWith("es")) return "es";
    if (raw.startsWith("de")) return "de";
    return "en";
}

function getStrings(locale?: string) {
    const lang = locale || getActiveLocale();
    return TRANSLATIONS[lang] || TRANSLATIONS.en;
}

function getAcronym(name: string): string {
    if (!name) return "?";
    return name
        .replace(/'s /g, " ")
        .replace(/\w+/g, e => e[0])
        .replace(/\s/g, "")
        .slice(0, 3)
        .toUpperCase();
}

function colorToHex(colorInt?: number | null): string {
    if (!colorInt) return "#5865f2";
    return "#" + Number(colorInt).toString(16).padStart(6, "0");
}

// Opérations Discord
async function apiLeaveGuild(guildId: string): Promise<any> {
    if (GuildActions && typeof GuildActions.leaveGuild === "function") {
        try {
            return await GuildActions.leaveGuild(guildId, false);
        } catch (err: any) {
            if (err?.status === 429 || (err?.message && err.message.includes("429"))) {
                const retry = (err?.body?.retry_after || 5) * 1000;
                await new Promise(r => setTimeout(r, retry));
                return await GuildActions.leaveGuild(guildId, false);
            }
            throw err;
        }
    }
    if (RestAPI && typeof RestAPI.del === "function") {
        return await RestAPI.del({ url: `/users/@me/guilds/${guildId}` });
    }
    throw new Error("Discord leaveGuild module unavailable");
}

async function apiMarkAsRead(guildId: string): Promise<any> {
    if (AckActions && typeof AckActions.ackGuild === "function") {
        return await AckActions.ackGuild(guildId);
    }
    if (RestAPI && typeof RestAPI.post === "function") {
        return await RestAPI.post({ url: `/guilds/${guildId}/ack` });
    }
}

async function apiSetMute(guildId: string, muted: boolean): Promise<any> {
    if (NotificationSettings && typeof NotificationSettings.updateGuildNotificationSettings === "function") {
        return await NotificationSettings.updateGuildNotificationSettings(guildId, { muted });
    }
    if (RestAPI && typeof RestAPI.patch === "function") {
        return await RestAPI.patch({
            url: `/users/@me/guilds/${guildId}/settings`,
            body: { muted }
        });
    }
}

function fetchGuildData() {
    const currentUserId = UserStore?.getCurrentUser?.()?.id;
    const allGuilds = GuildStore?.getGuilds?.() || {};
    const folders = SortedGuildStore?.getCompatibleGuildFolders?.() || [];

    const folderMap = new Map<string, { folderId: string | null; folderName: string | null; folderColor: number | null }>();
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

    const guildsList = Object.values(allGuilds).map((g: any) => {
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

    const distinctFolders: Array<{ id: string; name: string; color: number | null; count: number }> = [];
    const seen = new Set<string>();
    for (const folder of folders) {
        const fid = folder.folderId != null ? String(folder.folderId) : (folder.id != null ? String(folder.id) : null);
        if (fid && !seen.has(fid)) {
            seen.add(fid);
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

function extractFolderGuildIds(props: any): string[] {
    if (props?.guildIds && Array.isArray(props.guildIds) && props.guildIds.length > 0) {
        return props.guildIds;
    }
    const folders = SortedGuildStore?.getCompatibleGuildFolders?.() || [];
    const fid = props?.folderId ?? props?.id ?? props?.folderNode?.id;
    if (fid != null) {
        const found = folders.find((f: any) => (f.folderId != null && String(f.folderId) === String(fid)) || (f.id != null && String(f.id) === String(fid)));
        if (found?.guildIds) return found.guildIds;
    }
    if (props?.folderNode?.children && Array.isArray(props.folderNode.children)) {
        return props.folderNode.children.map((c: any) => c.id || c.guildId).filter(Boolean);
    }
    return [];
}

function extractFolderName(props: any, guildIds: string[]): string {
    if (props?.folderName) return props.folderName;
    const folders = SortedGuildStore?.getCompatibleGuildFolders?.() || [];
    const fid = props?.folderId ?? props?.id ?? props?.folderNode?.id;
    if (fid != null) {
        const found = folders.find((f: any) => (f.folderId != null && String(f.folderId) === String(fid)) || (f.id != null && String(f.id) === String(fid)));
        if (found?.folderName) return found.folderName;
    }
    return `Dossier (${guildIds.length})`;
}

// Modal Vencord
function BulkManagerModal({
    onClose,
    initialFolderId,
    preselectedGuildIds,
    autoStartAction
}: {
    onClose: () => void;
    initialFolderId?: string;
    preselectedGuildIds?: string[];
    autoStartAction?: "LEAVE";
}) {
    const [lang, setLang] = React.useState(getActiveLocale);
    const [data, setData] = React.useState(fetchGuildData);
    const [search, setSearch] = React.useState("");
    const [activeTab, setActiveTab] = React.useState(initialFolderId ? "FOLDER" : "ALL");
    const [folderFilter, setFolderFilter] = React.useState(initialFolderId ? String(initialFolderId) : "ALL");
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => {
        if (preselectedGuildIds && Array.isArray(preselectedGuildIds)) {
            return new Set(preselectedGuildIds);
        }
        return new Set();
    });
    const [delaySec, setDelaySec] = React.useState<number>(() => settings.store.delay || 1.5);

    const [taskRunning, setTaskRunning] = React.useState(false);
    const [taskType, setTaskType] = React.useState<string | null>(null);
    const [taskProgress, setTaskProgress] = React.useState({ current: 0, total: 0, currentGuild: "", percent: 0, successCount: 0, errorCount: 0 });
    const [taskLogs, setTaskLogs] = React.useState<Array<{ time: string; guildName: string; status: string; text: string }>>([]);
    const [taskDone, setTaskDone] = React.useState(false);
    const abortRef = React.useRef(false);
    const logsEndRef = React.useRef<HTMLDivElement | null>(null);

    const [confirmDialog, setConfirmDialog] = React.useState<any>(null);

    const t = getStrings(lang);

    const reload = () => {
        setData(fetchGuildData());
    };

    React.useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [taskLogs]);

    React.useEffect(() => {
        if (autoStartAction === "LEAVE" && preselectedGuildIds && preselectedGuildIds.length > 0) {
            const targetGuilds = data.guilds.filter(g => preselectedGuildIds.includes(g.id) && !g.isOwner);
            if (targetGuilds.length > 0) {
                runBulkAction("LEAVE", targetGuilds);
            }
        }
    }, []);

    const filteredGuilds = React.useMemo(() => {
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

    const toggleSelect = (id: string) => {
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
            for (const g of filteredGuilds) next.add(g.id);
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
            const next = new Set<string>();
            for (const g of filteredGuilds) {
                if (!prev.has(g.id)) next.add(g.id);
            }
            return next;
        });
    };

    const selectedGuilds = React.useMemo(() => {
        return data.guilds.filter(g => selectedIds.has(g.id));
    }, [data.guilds, selectedIds]);

    const runBulkAction = async (type: string, targetGuilds: any[]) => {
        if (!targetGuilds || targetGuilds.length === 0) return;

        setTaskRunning(true);
        setTaskType(type);
        setTaskDone(false);
        setTaskLogs([]);
        abortRef.current = false;

        const total = targetGuilds.length;
        const addLog = (guildName: string, status: string, text: string) => {
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
            } catch (err: any) {
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

    const countNoFolder = React.useMemo(() => data.guilds.filter(g => g.folderId == null).length, [data.guilds]);
    const countOwned = React.useMemo(() => data.guilds.filter(g => g.isOwner).length, [data.guilds]);

    return (
        <div className="vc-bulk-options-modal">
            {/* Header */}
            <div className="vc-bulk-header">
                <div className="vc-bulk-title">
                    {t.title}
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
                        ({data.guilds.length})
                    </span>
                </div>
                <div className="vc-bulk-header-controls">
                    <select
                        className="vc-bulk-lang-select"
                        value={lang}
                        onChange={e => setLang(e.target.value)}
                    >
                        <option value="fr">FR</option>
                        <option value="en">EN</option>
                        <option value="es">ES</option>
                        <option value="de">DE</option>
                    </select>
                    <button
                        className="vc-bulk-close-btn"
                        title={t.btnClose}
                        disabled={taskRunning}
                        onClick={onClose}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Filtres */}
            <div className="vc-bulk-filter-bar">
                <div className="vc-bulk-filter-row">
                    <div className="vc-bulk-search-box">
                        <svg className="vc-bulk-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className="vc-bulk-search-input"
                            placeholder={t.searchPlaceholder}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className="vc-bulk-search-clear" onClick={() => setSearch("")}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {activeTab === "FOLDER" && (
                        <select
                            className="vc-bulk-select"
                            value={folderFilter}
                            onChange={e => setFolderFilter(e.target.value)}
                        >
                            <option value="ALL">{t.allFolders}</option>
                            {data.folders.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.count})</option>
                            ))}
                        </select>
                    )}

                    <select
                        className="vc-bulk-select"
                        value={delaySec}
                        onChange={e => setDelaySec(parseFloat(e.target.value))}
                    >
                        <option value={1.0}>{t.delay} : 1.0s</option>
                        <option value={1.5}>{t.delay} : 1.5s</option>
                        <option value={2.0}>{t.delay} : 2.0s</option>
                        <option value={3.0}>{t.delay} : 3.0s</option>
                    </select>
                </div>

                <div className="vc-bulk-tabs-row">
                    <button
                        className={`vc-bulk-tab-btn ${activeTab === "ALL" ? "active" : ""}`}
                        onClick={() => setActiveTab("ALL")}
                    >
                        {t.tabAll} ({data.guilds.length})
                    </button>
                    {data.folders.length > 0 && (
                        <button
                            className={`vc-bulk-tab-btn ${activeTab === "FOLDER" ? "active" : ""}`}
                            onClick={() => setActiveTab("FOLDER")}
                        >
                            {t.tabFolders} ({data.folders.length})
                        </button>
                    )}
                    <button
                        className={`vc-bulk-tab-btn ${activeTab === "NO_FOLDER" ? "active" : ""}`}
                        onClick={() => setActiveTab("NO_FOLDER")}
                    >
                        {t.tabNoFolder} ({countNoFolder})
                    </button>
                    {countOwned > 0 && (
                        <button
                            className={`vc-bulk-tab-btn ${activeTab === "OWNED" ? "active" : ""}`}
                            onClick={() => setActiveTab("OWNED")}
                        >
                            {t.tabOwned} ({countOwned})
                        </button>
                    )}
                </div>
            </div>

            {/* Actions Bar */}
            <div className="vc-bulk-actions-bar">
                <div className="vc-bulk-selection-summary">
                    <button
                        className="vc-bulk-btn vc-bulk-btn-link"
                        onClick={selectAllVisible}
                        disabled={taskRunning || filteredGuilds.length === 0}
                    >
                        {t.selectAll}
                    </button>
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
                    <button
                        className="vc-bulk-btn vc-bulk-btn-link"
                        onClick={deselectAll}
                        disabled={taskRunning || selectedIds.size === 0}
                    >
                        {t.deselectAll}
                    </button>
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
                    <span className="vc-bulk-selection-count">
                        {t.selectedCount(selectedIds.size)}
                    </span>
                </div>

                <div className="vc-bulk-btn-group">
                    <button
                        className="vc-bulk-btn vc-bulk-btn-danger"
                        disabled={taskRunning || selectedGuilds.length === 0}
                        onClick={promptLeaveSelected}
                    >
                        {t.actionLeave} ({selectedGuilds.filter(g => !g.isOwner).length})
                    </button>
                    <button
                        className="vc-bulk-btn vc-bulk-btn-secondary"
                        disabled={taskRunning || selectedGuilds.length === 0}
                        onClick={() => runBulkAction("ACK", selectedGuilds)}
                    >
                        {t.actionAck}
                    </button>
                    <button
                        className="vc-bulk-btn vc-bulk-btn-secondary"
                        disabled={taskRunning || selectedGuilds.length === 0}
                        onClick={() => runBulkAction("MUTE", selectedGuilds)}
                    >
                        {t.actionMute}
                    </button>
                    <button
                        className="vc-bulk-btn vc-bulk-btn-secondary"
                        disabled={taskRunning || selectedGuilds.length === 0}
                        onClick={() => runBulkAction("UNMUTE", selectedGuilds)}
                    >
                        {t.actionUnmute}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="vc-bulk-list-container">
                {filteredGuilds.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13 }}>
                        {t.emptySearch}
                    </div>
                ) : (
                    filteredGuilds.map(guild => {
                        const isSelected = selectedIds.has(guild.id);
                        return (
                            <div
                                key={guild.id}
                                className={`vc-bulk-guild-row ${isSelected ? "selected" : ""}`}
                                onClick={() => toggleSelect(guild.id)}
                            >
                                <div
                                    className={`vc-bulk-checkbox ${isSelected ? "checked" : ""}`}
                                    onClick={e => {
                                        e.stopPropagation();
                                        toggleSelect(guild.id);
                                    }}
                                >
                                    {isSelected && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>

                                {guild.iconUrl ? (
                                    <img src={guild.iconUrl} className="vc-bulk-guild-icon" alt={guild.name} />
                                ) : (
                                    <div className="vc-bulk-guild-icon">{guild.acronym}</div>
                                )}

                                <div className="vc-bulk-guild-info">
                                    <div className="vc-bulk-guild-name">{guild.name}</div>
                                    <div className="vc-bulk-guild-meta">
                                        {guild.folderName && (
                                            <span className="vc-bulk-badge vc-bulk-badge-folder" style={{ borderLeftColor: colorToHex(guild.folderColor) }}>
                                                {guild.folderName}
                                            </span>
                                        )}
                                        {guild.isOwner && (
                                            <span className="vc-bulk-badge vc-bulk-badge-owner">
                                                {t.ownerBadge}
                                            </span>
                                        )}
                                        <span style={{ fontFamily: "monospace" }}>{guild.id}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="vc-bulk-footer">
                <span>{filteredGuilds.length} / {data.guilds.length}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {t.shortcutHint} <kbd style={{ background: "var(--background-tertiary)", padding: "2px 6px", borderRadius: 3 }}>{settings.store.shortcut || "Ctrl+Alt+B"}</kbd>
                </span>
            </div>

            {/* Execution Overlay */}
            {taskRunning && (
                <div className="vc-bulk-exec-overlay">
                    <div className="vc-bulk-exec-header">
                        <div className="vc-bulk-exec-title">
                            {taskDone ? t.execDone : t.execRunning}
                        </div>
                        <div className="vc-bulk-exec-status">
                            {taskProgress.current} / {taskProgress.total} ({taskProgress.percent}%)
                        </div>
                    </div>

                    <div className="vc-bulk-exec-body">
                        <div className="vc-bulk-progress-track">
                            <div
                                className={`vc-bulk-progress-fill ${taskType === "LEAVE" ? "danger" : ""}`}
                                style={{ width: `${taskProgress.percent}%` }}
                            />
                        </div>

                        <div className="vc-bulk-exec-metrics">
                            <span>
                                {t.current} : <strong style={{ color: "var(--header-primary)" }}>{taskDone ? t.execDone : (taskProgress.currentGuild || "...")}</strong>
                            </span>
                            <span>
                                <span style={{ color: "var(--status-positive, #23a55a)", marginRight: 12 }}>
                                    {t.statusSuccess(taskProgress.successCount)}
                                </span>
                                {taskProgress.errorCount > 0 && (
                                    <span style={{ color: "var(--status-danger, #da373c)" }}>
                                        {t.statusError(taskProgress.errorCount)}
                                    </span>
                                )}
                            </span>
                        </div>

                        <div className="vc-bulk-log-list">
                            {taskLogs.map((log, idx) => (
                                <div key={idx} className={`vc-bulk-log-row ${log.status}`}>
                                    <div className="vc-bulk-log-status-dot" />
                                    <span className="vc-bulk-log-target">{log.guildName}</span>
                                    <span className="vc-bulk-log-message">{log.text}</span>
                                    <span className="vc-bulk-log-time">{log.time}</span>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </div>

                    <div className="vc-bulk-exec-footer">
                        <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{t.activeRateLimit}</span>
                        {!taskDone ? (
                            <button className="vc-bulk-btn vc-bulk-btn-danger" onClick={stopTask}>
                                {t.btnStop}
                            </button>
                        ) : (
                            <button
                                className="vc-bulk-btn vc-bulk-btn-primary"
                                onClick={() => {
                                    setTaskRunning(false);
                                    setTaskDone(false);
                                }}
                            >
                                {t.btnClose}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmDialog && (
                <div className="gbm-backdrop" style={{ zIndex: 10001 }}>
                    <div className="gbm-confirm-dialog">
                        <div className="gbm-confirm-title">{confirmDialog.title}</div>
                        <div className="gbm-confirm-desc">{confirmDialog.description}</div>
                        {confirmDialog.ownedWarning && (
                            <div style={{ background: "rgba(240, 178, 50, 0.1)", borderLeft: "3px solid #f0b232", padding: "8px 12px", fontSize: 12, color: "#dbdee1" }}>
                                {confirmDialog.ownedWarning}
                            </div>
                        )}
                        <div className="gbm-confirm-list">
                            {confirmDialog.guilds.map((g: any) => (
                                <div key={g.id} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                                    <span style={{ color: "var(--header-primary)" }}>{g.name}</span>
                                    <span style={{ color: "var(--text-muted)", fontFamily: "monospace", fontSize: 11 }}>{g.id}</span>
                                </div>
                            ))}
                        </div>
                        <div className="gbm-confirm-actions">
                            <button className="vc-bulk-btn vc-bulk-btn-secondary" onClick={() => setConfirmDialog(null)}>
                                {t.btnCancel}
                            </button>
                            <button className="vc-bulk-btn vc-bulk-btn-danger" onClick={confirmDialog.onConfirm}>
                                {t.btnConfirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function openBulkManager(options: { initialFolderId?: string; preselectedGuildIds?: string[]; autoStartAction?: "LEAVE" } = {}) {
    openModal(modalProps => (
        <ModalRoot {...modalProps} size={ModalSize.LARGE}>
            <BulkManagerModal onClose={modalProps.onClose} {...options} />
        </ModalRoot>
    ));
}

function promptLeaveFolder(guildIds: string[], folderName: string) {
    const t = getStrings();
    if (!guildIds || guildIds.length === 0) {
        showToast(t.folderEmptyToast);
        return;
    }

    const currentUserId = UserStore?.getCurrentUser?.()?.id;
    const allGuilds = GuildStore?.getGuilds?.() || {};

    const folderGuilds = guildIds.map(id => allGuilds[id]).filter(Boolean);
    const validGuilds = folderGuilds.filter(g => !currentUserId || g.ownerId !== currentUserId);
    const ownedGuilds = folderGuilds.filter(g => currentUserId && g.ownerId === currentUserId);

    openModal(modalProps => (
        <ModalRoot {...modalProps} size={ModalSize.SMALL}>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--header-primary)" }}>
                    {t.confirmLeaveFolderTitle(folderName)}
                </div>
                <div style={{ fontSize: 13.5, color: "var(--text-normal)" }}>
                    {t.confirmLeaveFolderDesc(validGuilds.length)}
                </div>
                {ownedGuilds.length > 0 && (
                    <div style={{ background: "rgba(240, 178, 50, 0.1)", borderLeft: "3px solid #f0b232", padding: "8px 12px", fontSize: 12, color: "#dbdee1" }}>
                        {t.ownedWarning(ownedGuilds.length)}
                    </div>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                    <button className="vc-bulk-btn vc-bulk-btn-secondary" onClick={modalProps.onClose}>
                        {t.btnCancel}
                    </button>
                    <button
                        className="vc-bulk-btn vc-bulk-btn-danger"
                        onClick={() => {
                            modalProps.onClose();
                            openBulkManager({ preselectedGuildIds: validGuilds.map(g => g.id), autoStartAction: "LEAVE" });
                        }}
                    >
                        {t.actionLeave} ({validGuilds.length})
                    </button>
                </div>
            </div>
        </ModalRoot>
    ));
}

// Plugin Vencord
export default definePlugin({
    name: "BulkOptions",
    description: "Bulk server management for Vencord. Leave multiple servers, leave folders in one click, mark as read, or mute.",
    authors: [{ name: "Mathilde", id: 76065396n }],
    settings,

    unpatches: [] as Array<() => void>,

    start() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        window.addEventListener("keydown", this.handleKeyDown);

        // 1. Menu contextuel dossier
        const unpatchFolder = patch("guild-folder-context", (children: any[], props: any) => {
            const guildIds = extractFolderGuildIds(props);
            if (!guildIds || guildIds.length === 0) return;
            const folderName = extractFolderName(props, guildIds);
            const t = getStrings();

            children.push(
                <Menu.MenuGroup>
                    <Menu.MenuItem
                        id="vc-bulk-leave-folder"
                        label={t.contextMenuLeaveFolder(guildIds.length)}
                        color="danger"
                        action={() => promptLeaveFolder(guildIds, folderName)}
                    />
                    <Menu.MenuItem
                        id="vc-bulk-manage-folder"
                        label={t.contextMenuManageFolder}
                        action={() => {
                            const fid = props?.folderId ?? props?.id ?? props?.folderNode?.id;
                            openBulkManager({ initialFolderId: fid, preselectedGuildIds: guildIds });
                        }}
                    />
                </Menu.MenuGroup>
            );
        });

        // 2. Menu contextuel serveur individuel
        const unpatchGuild = patch("guild-context", (children: any[], props: any) => {
            const guildId = props?.guild?.id || props?.guildId;
            const t = getStrings();

            children.push(
                <Menu.MenuGroup>
                    <Menu.MenuItem
                        id="vc-bulk-manage-guild"
                        label={t.contextMenuManageServer}
                        action={() => openBulkManager({ preselectedGuildIds: guildId ? [guildId] : [] })}
                    />
                </Menu.MenuGroup>
            );
        });

        this.unpatches.push(unpatchFolder, unpatchGuild);
    },

    stop() {
        window.removeEventListener("keydown", this.handleKeyDown);
        for (const unpatch of this.unpatches) {
            try { unpatch(); } catch (e) {}
        }
        this.unpatches = [];
    },

    handleKeyDown(e: KeyboardEvent) {
        const raw = (settings.store.shortcut || "Ctrl+Alt+B").toLowerCase().replace(/\s+/g, "");
        const parts = raw.split("+");

        const wantCtrl = parts.includes("ctrl") || parts.includes("control");
        const wantAlt = parts.includes("alt");
        const wantShift = parts.includes("shift");
        const targetKey = parts.find(p => !["ctrl", "control", "alt", "shift", "meta"].includes(p));

        const hasCtrl = e.ctrlKey || e.metaKey;
        const hasAlt = e.altKey;
        const hasShift = e.shiftKey;
        const hasKey = targetKey ? e.key.toLowerCase() === targetKey : false;

        if (wantCtrl === hasCtrl && wantAlt === hasAlt && wantShift === hasShift && hasKey) {
            e.preventDefault();
            openBulkManager();
        }
    }
});
