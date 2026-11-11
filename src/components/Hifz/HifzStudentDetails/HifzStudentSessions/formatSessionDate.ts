// e.g. "9 Nov 2026" (same style as the tracker's date picker)
export const formatSessionDate = (value: string) => {
    const date = new Date(`${value}T00:00:00`);

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
