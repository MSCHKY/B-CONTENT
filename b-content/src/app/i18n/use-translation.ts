/**
 * Minimal i18n hook for B/CONTENT.
 * - Reads locale from localStorage (key: "b-content-locale")
 * - Defaults to "de"
 * - Re-renders on locale change via useSyncExternalStore
 */

import { useSyncExternalStore, useCallback } from "react";
import { translations, type Locale, type Translations } from "./translations";

const STORAGE_KEY = "b-content-locale";
const DEFAULT_LOCALE: Locale = "de";

// Simple event-based store so all components re-render on locale change
const listeners = new Set<() => void>();

function getLocale(): Locale {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "de" || stored === "en") return stored;
    } catch {
        // SSR or localStorage unavailable
    }
    return DEFAULT_LOCALE;
}

function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function getSnapshot(): Locale {
    return getLocale();
}

/**
 * Sets the active locale and updates local storage.
 * Subscribed components will re-render automatically.
 *
 * @param {Locale} locale - The new locale to set.
 */
export function setLocale(locale: Locale): void {
    try {
        localStorage.setItem(STORAGE_KEY, locale);
    } catch {
        // ignore
    }
    // Notify all subscribers
    listeners.forEach((cb) => cb());
}

/**
 * Hook to access translations and manage the active locale.
 * Uses `useSyncExternalStore` for global state synchronization.
 *
 * @returns {Object} Translation dictionary, current locale, and setter functions.
 * @example
 * const { t, locale, toggleLocale } = useTranslation();
 * console.log(t.common.loading);
 */
export function useTranslation(): {
    t: Translations;
    locale: Locale;
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
} {
    const locale = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_LOCALE);

    const toggleLocale = useCallback(() => {
        setLocale(locale === "de" ? "en" : "de");
    }, [locale]);

    return {
        t: translations[locale],
        locale,
        setLocale,
        toggleLocale,
    };
}
