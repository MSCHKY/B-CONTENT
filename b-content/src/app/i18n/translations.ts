/**
 * Minimal i18n translations for B/CONTENT.
 * No external dependencies — just a typed object per language.
 */

export type Locale = "de" | "en";

export interface Translations {
    // --- Navigation ---
    nav: {
        create: string;
        knowledge: string;
        library: string;
        orchestrate: string;
        stats: string;
    };

    // --- Create Flow ---
    create: {
        title: string;
        startOver: string;
        steps: [string, string, string, string];
        instancePicker: {
            subtitle: string;
        };
        topicInput: {
            topicLabel: string;
            topicPlaceholder: string;
            inputLabel: string;
            inputPlaceholder: string;
            languageLabel: string;
            quotesTitle: string;
            generate: string;
            generating: string;
        };
        result: {
            title: string;
            copy: string;
            copied: string;
            saveToLibrary: string;
            saved: string;
            newPost: string;
            charCount: string;
            hashtagsLabel: string;
            mockNotice: string;
        };
    };

    // --- Knowledge ---
    knowledge: {
        title: string;
        subtitle: string;
        tabs: {
            topics: string;
            quotes: string;
            rules: string;
        };
        coreMessage: string;
        facts: string;
        keywords: string;
        editor: {
            edit: string;
            save: string;
            cancel: string;
            delete: string;
            confirmDelete: string;
            addFact: string;
            addQuote: string;
            addKeyword: string;
            factPlaceholder: string;
            quotePlaceholder: string;
            authorLabel: string;
            topicsLabel: string;
            emotionLabel: string;
            contextLabel: string;
            saved: string;
            deleted: string;
        };
    };

    // --- Library ---
    library: {
        title: string;
        subtitle: string;
        filterInstance: string;
        filterStatus: string;
        allInstances: string;
        allStatuses: string;
        noPosts: string;
        noPostsHint: string;
        copyText: string;
        downloadImage: string;
        delete: string;
        confirmDelete: string;
        statusLabels: {
            draft: string;
            review: string;
            approved: string;
            published: string;
        };
    };

    // --- Orchestrate ---
    orchestrate: {
        title: string;
        subtitle: string;
        topicLabel: string;
        topicPlaceholder: string;
        generateWeek: string;
        generating: string;
        result: {
            weekPlan: string;
            copyAll: string;
            saveAll: string;
            saved: string;
            suggestedDay: string;
            copy: string;
            copied: string;
        };
        mockNotice: string;
    };

    // --- Stats ---
    stats: {
        title: string;
        subtitle: string;
        totalPosts: string;
        thisMonth: string;
        topicsUsed: string;
        instances: string;
        ratioTracker: string;
        ratioRule: string;
        topicDistribution: string;
        noPostsYet: string;
        noPostsHint: string;
        expert: string;
        personal: string;
        nextPersonal: string;
        attentionRequired: string;
    };

    // --- Common ---
    common: {
        loading: string;
        error: string;
        noData: string;
    };
}

export const de: Translations = {
    nav: {
        create: "Erstellen",
        knowledge: "Wissen",
        library: "Bibliothek",
        orchestrate: "Orchestrieren",
        stats: "Statistik",
    },

    create: {
        title: "Content erstellen",
        startOver: "↺ Neu starten",
        steps: ["Instanz", "Inhaltstyp", "Eingabe", "Ergebnis"],
        instancePicker: {
            subtitle: "Für wen soll der Content erstellt werden?",
        },
        topicInput: {
            topicLabel: "Themenfeld",
            topicPlaceholder: "Themenfeld wählen…",
            inputLabel: "Ihr Input",
            inputPlaceholder: "Beschreiben Sie Ihr Thema, Kernaussage oder Fakten…",
            languageLabel: "Sprache",
            quotesTitle: "Passende Zitate",
            generate: "Generieren",
            generating: "Wird generiert…",
        },
        result: {
            title: "Ergebnis",
            copy: "Kopieren",
            copied: "Kopiert!",
            saveToLibrary: "In Bibliothek speichern",
            saved: "Gespeichert!",
            newPost: "Neuer Beitrag",
            charCount: "Zeichen",
            hashtagsLabel: "Hashtags",
            mockNotice: "Demo-Modus: Kein API-Key konfiguriert.",
        },
    },

    knowledge: {
        title: "Wissensbasis",
        subtitle: "Themenfelder, Zitate und Content-Regeln der BenderWire Group.",
        tabs: {
            topics: "Themenfelder",
            quotes: "Zitate",
            rules: "Regeln",
        },
        coreMessage: "Kernbotschaft",
        facts: "Fakten",
        keywords: "Schlüsselwörter",
        editor: {
            edit: "Bearbeiten",
            save: "Speichern",
            cancel: "Abbrechen",
            delete: "Löschen",
            confirmDelete: "Wirklich löschen?",
            addFact: "Fakt hinzufügen",
            addQuote: "Zitat hinzufügen",
            addKeyword: "Schlüsselwort hinzufügen",
            factPlaceholder: "Neuen Fakt eingeben…",
            quotePlaceholder: "Zitattext eingeben…",
            authorLabel: "Autor",
            topicsLabel: "Themenfelder",
            emotionLabel: "Emotion",
            contextLabel: "Kontext",
            saved: "Gespeichert!",
            deleted: "Gelöscht!",
        },
    },

    library: {
        title: "Content-Bibliothek",
        subtitle: "Gespeicherte Beiträge und Bilder verwalten.",
        filterInstance: "Instanz filtern",
        filterStatus: "Status filtern",
        allInstances: "Alle Instanzen",
        allStatuses: "Alle Status",
        noPosts: "Noch keine Beiträge",
        noPostsHint: "Erstellen und speichern Sie Content im Erstellen-Bereich.",
        copyText: "Text kopieren",
        downloadImage: "Bild herunterladen",
        delete: "Löschen",
        confirmDelete: "Beitrag wirklich löschen?",
        statusLabels: {
            draft: "Entwurf",
            review: "Review",
            approved: "Freigegeben",
            published: "Veröffentlicht",
        },
    },

    orchestrate: {
        title: "Content-Orchestrierung",
        subtitle: "Dreier-Regel: Für jedes Thema gleichzeitig 3 Beiträge aus verschiedenen Perspektiven generieren.",
        topicLabel: "Themenfeld",
        topicPlaceholder: "Themenfeld wählen…",
        generateWeek: "3er-Set generieren",
        generating: "Wird generiert…",
        result: {
            weekPlan: "Dreier-Set",
            copyAll: "Alle kopieren",
            saveAll: "Alle speichern",
            saved: "Gespeichert!",
            suggestedDay: "Empfohlener Tag",
            copy: "Kopieren",
            copied: "Kopiert!",
        },
        mockNotice: "Demo-Modus: Kein API-Key konfiguriert.",
    },

    stats: {
        title: "Content-Statistik",
        subtitle: "Posting-Verhältnis, Themenverteilung und Content-Gesundheit aller Instanzen.",
        totalPosts: "Beiträge gesamt",
        thisMonth: "Dieser Monat",
        topicsUsed: "Themen genutzt",
        instances: "Instanzen",
        ratioTracker: "4:1 Ratio Tracker",
        ratioRule: "Regel: 4 Fach-Beiträge, dann 1 persönlicher Beitrag pro Instanz.",
        topicDistribution: "Themenverteilung",
        noPostsYet: "Noch keine Beiträge",
        noPostsHint: "Erstellen Sie Content, um die Verteilung zu sehen.",
        expert: "Fachlich",
        personal: "Persönlich",
        nextPersonal: "Nächster: Persönlich",
        attentionRequired: "Handlungsbedarf",
    },

    common: {
        loading: "Wird geladen…",
        error: "Ein Fehler ist aufgetreten.",
        noData: "Keine Daten verfügbar.",
    },
};

export const en: Translations = {
    nav: {
        create: "Create",
        knowledge: "Knowledge",
        library: "Library",
        orchestrate: "Orchestrate",
        stats: "Stats",
    },

    create: {
        title: "Create Content",
        startOver: "↺ Start Over",
        steps: ["Instance", "Content Type", "Input", "Result"],
        instancePicker: {
            subtitle: "Who should this content be created for?",
        },
        topicInput: {
            topicLabel: "Topic Field",
            topicPlaceholder: "Select a topic…",
            inputLabel: "Your Input",
            inputPlaceholder: "Describe your topic, key message or facts…",
            languageLabel: "Language",
            quotesTitle: "Relevant Quotes",
            generate: "Generate",
            generating: "Generating…",
        },
        result: {
            title: "Result",
            copy: "Copy",
            copied: "Copied!",
            saveToLibrary: "Save to Library",
            saved: "Saved!",
            newPost: "New Post",
            charCount: "Characters",
            hashtagsLabel: "Hashtags",
            mockNotice: "Demo mode: No API key configured.",
        },
    },

    knowledge: {
        title: "Knowledge Base",
        subtitle: "Topic fields, quotes, and content rules for BenderWire Group.",
        tabs: {
            topics: "Topics",
            quotes: "Quotes",
            rules: "Rules",
        },
        coreMessage: "Core Message",
        facts: "Facts",
        keywords: "Keywords",
        editor: {
            edit: "Edit",
            save: "Save",
            cancel: "Cancel",
            delete: "Delete",
            confirmDelete: "Really delete?",
            addFact: "Add fact",
            addQuote: "Add quote",
            addKeyword: "Add keyword",
            factPlaceholder: "Enter a new fact…",
            quotePlaceholder: "Enter quote text…",
            authorLabel: "Author",
            topicsLabel: "Topic Fields",
            emotionLabel: "Emotion",
            contextLabel: "Context",
            saved: "Saved!",
            deleted: "Deleted!",
        },
    },

    library: {
        title: "Content Library",
        subtitle: "Manage saved posts and images.",
        filterInstance: "Filter by instance",
        filterStatus: "Filter by status",
        allInstances: "All Instances",
        allStatuses: "All Statuses",
        noPosts: "No posts yet",
        noPostsHint: "Create and save content in the Create view.",
        copyText: "Copy text",
        downloadImage: "Download image",
        delete: "Delete",
        confirmDelete: "Really delete this post?",
        statusLabels: {
            draft: "Draft",
            review: "Review",
            approved: "Approved",
            published: "Published",
        },
    },

    orchestrate: {
        title: "Content Orchestration",
        subtitle: "Rule of Three: Generate 3 posts for any topic from different perspectives simultaneously.",
        topicLabel: "Topic Field",
        topicPlaceholder: "Select a topic…",
        generateWeek: "Generate Set of 3",
        generating: "Generating…",
        result: {
            weekPlan: "Set of Three",
            copyAll: "Copy All",
            saveAll: "Save All",
            saved: "Saved!",
            suggestedDay: "Suggested Day",
            copy: "Copy",
            copied: "Copied!",
        },
        mockNotice: "Demo mode: No API key configured.",
    },

    stats: {
        title: "Content Stats",
        subtitle: "Track posting ratios, topic distribution, and content health across all instances.",
        totalPosts: "Total Posts",
        thisMonth: "This Month",
        topicsUsed: "Topics Used",
        instances: "Instances",
        ratioTracker: "4:1 Ratio Tracker",
        ratioRule: "Rule: 4 expert posts, then 1 personal post per instance.",
        topicDistribution: "Topic Distribution",
        noPostsYet: "No posts yet",
        noPostsHint: "Generate content to see the distribution.",
        expert: "Expert",
        personal: "Personal",
        nextPersonal: "Next: Personal",
        attentionRequired: "Attention Required",
    },

    common: {
        loading: "Loading…",
        error: "An error occurred.",
        noData: "No data available.",
    },
};

export const translations: Record<Locale, Translations> = { de, en };
