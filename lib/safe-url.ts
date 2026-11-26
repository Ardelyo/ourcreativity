// Hanya izinkan http(s) untuk link buatan user (cegah javascript: / data: URL).
export const safeHttpUrl = (value: string | null | undefined): string | undefined => {
    if (!value) return undefined;
    try {
        const url = new URL(value.trim());
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined;
    } catch {
        return undefined;
    }
};
